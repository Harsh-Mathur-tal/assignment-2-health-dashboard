"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.existsCache = exports.deleteCache = exports.getCache = exports.setCache = exports.disconnectRedis = exports.connectRedis = void 0;
const redis_1 = require("redis");
const logger_1 = require("../utils/logger");
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        connectTimeout: 5000,
    },
    password: process.env.REDIS_PASSWORD || undefined,
});
redisClient.on('connect', () => {
    logger_1.logger.info('Connected to Redis');
});
redisClient.on('error', (err) => {
    logger_1.logger.error('Redis connection error:', err);
});
redisClient.on('ready', () => {
    logger_1.logger.info('Redis client ready');
});
redisClient.on('end', () => {
    logger_1.logger.info('Redis connection ended');
});
const connectRedis = async () => {
    console.log('⚠️  Skipping Redis connection for demo purposes');
    logger_1.logger.warn('Skipping Redis connection for demo purposes');
    return Promise.resolve();
};
exports.connectRedis = connectRedis;
const disconnectRedis = async () => {
    try {
        await redisClient.disconnect();
        logger_1.logger.info('Redis client disconnected successfully');
    }
    catch (error) {
        logger_1.logger.error('Failed to disconnect Redis:', error);
    }
};
exports.disconnectRedis = disconnectRedis;
const setCache = async (key, value, expiration = 3600) => {
    try {
        const serializedValue = JSON.stringify(value);
        await redisClient.setEx(key, expiration, serializedValue);
    }
    catch (error) {
        logger_1.logger.error('Error setting cache:', error);
    }
};
exports.setCache = setCache;
const getCache = async (key) => {
    try {
        const value = await redisClient.get(key);
        return value ? JSON.parse(value) : null;
    }
    catch (error) {
        logger_1.logger.error('Error getting cache:', error);
        return null;
    }
};
exports.getCache = getCache;
const deleteCache = async (key) => {
    try {
        await redisClient.del(key);
    }
    catch (error) {
        logger_1.logger.error('Error deleting cache:', error);
    }
};
exports.deleteCache = deleteCache;
const existsCache = async (key) => {
    try {
        const exists = await redisClient.exists(key);
        return exists === 1;
    }
    catch (error) {
        logger_1.logger.error('Error checking cache existence:', error);
        return false;
    }
};
exports.existsCache = existsCache;
exports.default = redisClient;
//# sourceMappingURL=redis.js.map