"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = exports.query = void 0;
const pg_1 = require("pg");
const logger_1 = require("../utils/logger");
const pool = new pg_1.Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'cicd_dashboard',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
pool.on('connect', () => {
    logger_1.logger.info('Connected to PostgreSQL database');
});
pool.on('error', (err) => {
    logger_1.logger.error('PostgreSQL connection error:', err);
    process.exit(-1);
});
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        logger_1.logger.debug('Executed query', { text, duration, rows: res.rowCount });
        return res;
    }
    catch (error) {
        logger_1.logger.error('Database query error:', error);
        throw error;
    }
};
exports.query = query;
const getClient = async () => {
    const client = await pool.connect();
    return client;
};
exports.getClient = getClient;
exports.default = pool;
//# sourceMappingURL=database.js.map