import { createClient } from 'redis';
import { logger } from '../utils/logger';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    connectTimeout: 5000,
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

redisClient.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

redisClient.on('ready', () => {
  logger.info('Redis client ready');
});

redisClient.on('end', () => {
  logger.info('Redis connection ended');
});

export const connectRedis = async () => {
  // Skip Redis connection for demo mode
  console.log('⚠️  Skipping Redis connection for demo purposes');
  logger.warn('Skipping Redis connection for demo purposes');
  return Promise.resolve();
};

export const disconnectRedis = async () => {
  try {
    await redisClient.disconnect();
    logger.info('Redis client disconnected successfully');
  } catch (error) {
    logger.error('Failed to disconnect Redis:', error);
  }
};

// Cache helper functions
export const setCache = async (key: string, value: any, expiration = 3600): Promise<void> => {
  try {
    const serializedValue = JSON.stringify(value);
    await redisClient.setEx(key, expiration, serializedValue);
  } catch (error) {
    logger.error('Error setting cache:', error);
  }
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error('Error getting cache:', error);
    return null;
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error('Error deleting cache:', error);
  }
};

export const existsCache = async (key: string): Promise<boolean> => {
  try {
    const exists = await redisClient.exists(key);
    return exists === 1;
  } catch (error) {
    logger.error('Error checking cache existence:', error);
    return false;
  }
};

export default redisClient;
