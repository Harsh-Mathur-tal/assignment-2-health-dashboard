"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const app_1 = __importDefault(require("./app"));
const logger_1 = require("./utils/logger");
async function bootstrap() {
    try {
        console.log('🚀 Starting CI/CD Dashboard bootstrap process...');
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
        console.log('🏗️ Creating application instance...');
        const app = new app_1.default();
        console.log('⚡ Initializing application dependencies...');
        await app.initialize();
        const port = parseInt(process.env.PORT || '3001');
        app.listen(port);
        logger_1.logger.info('🚀 CI/CD Pipeline Health Dashboard API started successfully');
        logger_1.logger.info(`📊 Dashboard available at: http://localhost:${port}`);
        logger_1.logger.info(`🔧 API endpoints available at: http://localhost:${port}/api`);
        logger_1.logger.info(`❤️ Health check available at: http://localhost:${port}/health`);
    }
    catch (error) {
        logger_1.logger.error('Failed to start application:', error);
        process.exit(1);
    }
}
process.on('uncaughtException', (error) => {
    logger_1.logger.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.logger.error('Unhandled Rejection at:', { promise, reason });
});
bootstrap();
//# sourceMappingURL=index.js.map