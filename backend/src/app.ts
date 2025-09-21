import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import http from 'http';
import { logger } from './utils/logger';
import { connectRedis } from './config/redis';

// Route imports
import pipelineRoutes from './routes/pipelines';
import metricsRoutes from './routes/metrics';
import alertRoutes from './routes/alerts';
import webhookRoutes from './routes/webhooks';
import integrationRoutes from './routes/integrations';
import demoRoutes from './routes/demo';
import monitoringRoutes from './routes/monitoring';

// Middleware imports
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

class App {
  public app: express.Application;
  public server: http.Server;
  public io: Server;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSocketIO();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
      message: {
        error: 'Too many requests from this IP, please try again later.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compression middleware
    this.app.use(compression());

    // Logging middleware
    this.app.use(morgan('combined', {
      stream: {
        write: (message: string) => {
          logger.info(message.trim());
        },
      },
    }));

    // Custom request logger
    this.app.use(requestLogger);

    // Health check endpoint (before authentication)
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
      });
    });
  }

  private initializeRoutes(): void {
    // Public routes
    this.app.use('/api/webhooks', webhookRoutes);
    this.app.use('/api/monitoring', monitoringRoutes); // Monitoring endpoints (public for Prometheus)

    // API routes (no authentication required)
    this.app.use('/api/pipelines', pipelineRoutes);
    this.app.use('/api/metrics', metricsRoutes);
    this.app.use('/api/alerts', alertRoutes);
    this.app.use('/api/integrations', integrationRoutes);
    this.app.use('/api/demo', demoRoutes);

    // API documentation endpoint
    this.app.get('/api', (req, res) => {
      res.json({
        name: 'CI/CD Pipeline Health Dashboard API',
        version: '1.0.0',
        description: 'REST API for monitoring CI/CD pipeline health and metrics',
        endpoints: {
          pipelines: '/api/pipelines',
          metrics: '/api/metrics',
          alerts: '/api/alerts',
          webhooks: '/api/webhooks',
          integrations: '/api/integrations',
          demo: '/api/demo',
          monitoring: '/api/monitoring',
        },
        documentation: '/api/docs',
        health: '/health',
      });
    });

    // 404 handler for undefined routes
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Route not found',
        message: `The requested route ${req.originalUrl} does not exist.`,
      });
    });
  }

  private initializeSocketIO(): void {
    // Socket.IO connection handling
    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);

      // Handle dashboard subscription
      socket.on('subscribe:dashboard', () => {
        socket.join('dashboard');
        logger.debug(`Client ${socket.id} subscribed to dashboard updates`);
      });

      // Handle pipeline subscription
      socket.on('subscribe:pipeline', (pipelineId: string) => {
        socket.join(`pipeline:${pipelineId}`);
        logger.debug(`Client ${socket.id} subscribed to pipeline ${pipelineId}`);
      });

      // Handle pipeline unsubscription
      socket.on('unsubscribe:pipeline', (pipelineId: string) => {
        socket.leave(`pipeline:${pipelineId}`);
        logger.debug(`Client ${socket.id} unsubscribed from pipeline ${pipelineId}`);
      });

      // Handle alerts subscription
      socket.on('subscribe:alerts', () => {
        socket.join('alerts');
        logger.debug(`Client ${socket.id} subscribed to alerts`);
      });

      // Handle disconnection
      socket.on('disconnect', (reason) => {
        logger.info(`Client disconnected: ${socket.id}, reason: ${reason}`);
      });

      // Handle connection errors
      socket.on('error', (error) => {
        logger.error(`Socket error for client ${socket.id}:`, error);
      });
    });

    // Store io instance globally for use in other modules
    global.io = this.io;
  }

  private initializeErrorHandling(): void {
    // Global error handler (must be last)
    this.app.use(errorHandler);

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      logger.error('Unhandled Rejection at:', { promise, reason });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      this.server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      this.server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });
  }

  public async initialize(): Promise<void> {
    try {
      console.log('🔄 Connecting to Redis...');
      // Initialize Redis connection
      await connectRedis();
      console.log('✅ Redis connection established');
      logger.info('Application dependencies initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize application dependencies:', error);
      logger.error('Failed to initialize application dependencies:', error);
      throw error;
    }
  }

  public listen(port: number): void {
    this.server.listen(port, () => {
      logger.info(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
      logger.info(`Health check available at: http://localhost:${port}/health`);
      logger.info(`API documentation available at: http://localhost:${port}/api`);
    });
  }
}

export default App;
