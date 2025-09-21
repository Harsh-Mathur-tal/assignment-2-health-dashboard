"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const logger_1 = require("./utils/logger");
const redis_1 = require("./config/redis");
const pipelines_1 = __importDefault(require("./routes/pipelines"));
const metrics_1 = __importDefault(require("./routes/metrics"));
const alerts_1 = __importDefault(require("./routes/alerts"));
const webhooks_1 = __importDefault(require("./routes/webhooks"));
const integrations_1 = __importDefault(require("./routes/integrations"));
const demo_1 = __importDefault(require("./routes/demo"));
const monitoring_1 = __importDefault(require("./routes/monitoring"));
const errorHandler_1 = require("./middleware/errorHandler");
const requestLogger_1 = require("./middleware/requestLogger");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.server = http_1.default.createServer(this.app);
        this.io = new socket_io_1.Server(this.server, {
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
    initializeMiddlewares() {
        this.app.use((0, helmet_1.default)({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                },
            },
        }));
        this.app.use((0, cors_1.default)({
            origin: process.env.NODE_ENV === 'production'
                ? process.env.FRONTEND_URL
                : ['http://localhost:3000', 'http://127.0.0.1:3000'],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }));
        const limiter = (0, express_rate_limit_1.default)({
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
            max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
            message: {
                error: 'Too many requests from this IP, please try again later.',
            },
            standardHeaders: true,
            legacyHeaders: false,
        });
        this.app.use('/api/', limiter);
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        this.app.use((0, compression_1.default)());
        this.app.use((0, morgan_1.default)('combined', {
            stream: {
                write: (message) => {
                    logger_1.logger.info(message.trim());
                },
            },
        }));
        this.app.use(requestLogger_1.requestLogger);
        this.app.get('/health', (req, res) => {
            res.status(200).json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: process.env.NODE_ENV || 'development',
            });
        });
    }
    initializeRoutes() {
        this.app.use('/api/webhooks', webhooks_1.default);
        this.app.use('/api/monitoring', monitoring_1.default);
        this.app.use('/api/pipelines', pipelines_1.default);
        this.app.use('/api/metrics', metrics_1.default);
        this.app.use('/api/alerts', alerts_1.default);
        this.app.use('/api/integrations', integrations_1.default);
        this.app.use('/api/demo', demo_1.default);
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
        this.app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                error: 'Route not found',
                message: `The requested route ${req.originalUrl} does not exist.`,
            });
        });
    }
    initializeSocketIO() {
        this.io.on('connection', (socket) => {
            logger_1.logger.info(`Client connected: ${socket.id}`);
            socket.on('subscribe:dashboard', () => {
                socket.join('dashboard');
                logger_1.logger.debug(`Client ${socket.id} subscribed to dashboard updates`);
            });
            socket.on('subscribe:pipeline', (pipelineId) => {
                socket.join(`pipeline:${pipelineId}`);
                logger_1.logger.debug(`Client ${socket.id} subscribed to pipeline ${pipelineId}`);
            });
            socket.on('unsubscribe:pipeline', (pipelineId) => {
                socket.leave(`pipeline:${pipelineId}`);
                logger_1.logger.debug(`Client ${socket.id} unsubscribed from pipeline ${pipelineId}`);
            });
            socket.on('subscribe:alerts', () => {
                socket.join('alerts');
                logger_1.logger.debug(`Client ${socket.id} subscribed to alerts`);
            });
            socket.on('disconnect', (reason) => {
                logger_1.logger.info(`Client disconnected: ${socket.id}, reason: ${reason}`);
            });
            socket.on('error', (error) => {
                logger_1.logger.error(`Socket error for client ${socket.id}:`, error);
            });
        });
        global.io = this.io;
    }
    initializeErrorHandling() {
        this.app.use(errorHandler_1.errorHandler);
        process.on('unhandledRejection', (reason, promise) => {
            logger_1.logger.error('Unhandled Rejection at:', { promise, reason });
        });
        process.on('uncaughtException', (error) => {
            logger_1.logger.error('Uncaught Exception:', error);
            process.exit(1);
        });
        process.on('SIGTERM', () => {
            logger_1.logger.info('SIGTERM received, shutting down gracefully');
            this.server.close(() => {
                logger_1.logger.info('Process terminated');
                process.exit(0);
            });
        });
        process.on('SIGINT', () => {
            logger_1.logger.info('SIGINT received, shutting down gracefully');
            this.server.close(() => {
                logger_1.logger.info('Process terminated');
                process.exit(0);
            });
        });
    }
    async initialize() {
        try {
            console.log('🔄 Connecting to Redis...');
            await (0, redis_1.connectRedis)();
            console.log('✅ Redis connection established');
            logger_1.logger.info('Application dependencies initialized successfully');
        }
        catch (error) {
            console.error('❌ Failed to initialize application dependencies:', error);
            logger_1.logger.error('Failed to initialize application dependencies:', error);
            throw error;
        }
    }
    listen(port) {
        this.server.listen(port, () => {
            logger_1.logger.info(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
            logger_1.logger.info(`Health check available at: http://localhost:${port}/health`);
            logger_1.logger.info(`API documentation available at: http://localhost:${port}/api`);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map