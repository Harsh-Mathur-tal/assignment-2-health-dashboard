"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAlert = exports.logWebhookReceived = exports.logExternalApiCall = exports.logDatabaseQuery = exports.requestLogger = void 0;
const logger_1 = require("../utils/logger");
const uuid_1 = require("uuid");
const requestLogger = (req, res, next) => {
    req.id = (0, uuid_1.v4)();
    const startTime = Date.now();
    logger_1.logger.info('Incoming request', {
        requestId: req.id,
        method: req.method,
        url: req.url,
        path: req.path,
        query: req.query,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        referer: req.get('Referer'),
        contentType: req.get('Content-Type'),
        contentLength: req.get('Content-Length'),
        timestamp: new Date().toISOString(),
    });
    if (req.method !== 'GET' && req.body) {
        const sanitizedBody = sanitizeRequestBody(req.body, req.path);
        if (Object.keys(sanitizedBody).length > 0) {
            logger_1.logger.debug('Request body', {
                requestId: req.id,
                body: sanitizedBody,
            });
        }
    }
    const originalEnd = res.end;
    res.end = function (chunk, encoding) {
        const duration = Date.now() - startTime;
        logger_1.logger.info('Request completed', {
            requestId: req.id,
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            contentLength: res.get('Content-Length'),
            timestamp: new Date().toISOString(),
        });
        if (duration > 1000) {
            logger_1.logger.warn('Slow request detected', {
                requestId: req.id,
                method: req.method,
                url: req.url,
                duration: `${duration}ms`,
            });
        }
        return originalEnd.call(this, chunk, encoding);
    };
    next();
};
exports.requestLogger = requestLogger;
const sanitizeRequestBody = (body, path) => {
    if (!body || typeof body !== 'object') {
        return {};
    }
    const sensitiveFields = [
        'password',
        'token',
        'secret',
        'key',
        'auth',
        'authorization',
        'credential',
        'private',
    ];
    const sensitiveRoutes = [
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/refresh',
        '/api/integrations',
    ];
    if (sensitiveRoutes.some(route => path.includes(route))) {
        return { '[REDACTED]': 'Sensitive data not logged' };
    }
    const sanitized = {};
    for (const [key, value] of Object.entries(body)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveFields.some(field => lowerKey.includes(field))) {
            sanitized[key] = '[REDACTED]';
        }
        else if (value && typeof value === 'object') {
            sanitized[key] = sanitizeRequestBody(value, path);
        }
        else {
            sanitized[key] = value;
        }
    }
    return sanitized;
};
const logDatabaseQuery = (query, params, duration) => {
    logger_1.logger.debug('Database query', {
        query: query.replace(/\s+/g, ' ').trim(),
        params: params?.map(param => typeof param === 'string' && param.length > 100
            ? `${param.substring(0, 100)}...`
            : param),
        duration: duration ? `${duration}ms` : undefined,
        timestamp: new Date().toISOString(),
    });
};
exports.logDatabaseQuery = logDatabaseQuery;
const logExternalApiCall = (service, method, url, statusCode, duration) => {
    logger_1.logger.info('External API call', {
        service,
        method,
        url,
        statusCode,
        duration: duration ? `${duration}ms` : undefined,
        timestamp: new Date().toISOString(),
    });
};
exports.logExternalApiCall = logExternalApiCall;
const logWebhookReceived = (platform, event, payload) => {
    logger_1.logger.info('Webhook received', {
        platform,
        event,
        payloadSize: payload ? JSON.stringify(payload).length : 0,
        timestamp: new Date().toISOString(),
    });
};
exports.logWebhookReceived = logWebhookReceived;
const logAlert = (alertType, pipelineId, severity, message) => {
    logger_1.logger.warn('Alert triggered', {
        alertType,
        pipelineId,
        severity,
        message,
        timestamp: new Date().toISOString(),
    });
};
exports.logAlert = logAlert;
//# sourceMappingURL=requestLogger.js.map