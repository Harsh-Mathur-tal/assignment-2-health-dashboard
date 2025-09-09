import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

import App from './app';
import { logger } from './utils/logger';

// Global type declaration for Socket.IO
declare global {
  var io: any;
}

async function bootstrap() {
  try {
    console.log('🚀 Starting CI/CD Dashboard bootstrap process...');
    
    // Validate required environment variables
    const requiredEnvVars = [
      'JWT_SECRET',
      'DB_HOST',
      'DB_NAME',
      'DB_USER',
    ];

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    if (missingEnvVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }

    console.log('✅ Environment variables validated');

    // Create and initialize the application
    console.log('🏗️ Creating application instance...');
    const app = new App();
    
    console.log('⚡ Initializing application dependencies...');
    await app.initialize();

    // Start the server
    const port = parseInt(process.env.PORT || '3001');
    app.listen(port);

    logger.info('🚀 CI/CD Pipeline Health Dashboard API started successfully');
    logger.info(`📊 Dashboard available at: http://localhost:${port}`);
    logger.info(`🔧 API endpoints available at: http://localhost:${port}/api`);
    logger.info(`❤️ Health check available at: http://localhost:${port}/health`);

  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions before they crash the process
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
});

// Start the application
bootstrap();
