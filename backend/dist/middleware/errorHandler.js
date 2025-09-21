"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalError = exports.validationError = exports.conflict = exports.notFoundError = exports.forbidden = exports.unauthorized = exports.badRequest = exports.notFound = exports.asyncHandler = exports.errorHandler = exports.createError = exports.CustomError = void 0;
const logger_1 = require("../utils/logger");
class CustomError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
const createError = (message, statusCode = 500) => {
    return new CustomError(message, statusCode);
};
exports.createError = createError;
const errorHandler = (error, req, res, next) => {
    let { statusCode = 500, message } = error;
    logger_1.logger.error('Error handled:', {
        error: message,
        statusCode,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error: ' + message;
    }
    else if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    }
    else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }
    else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }
    else if (error.message && error.message.includes('duplicate key')) {
        statusCode = 409;
        message = 'Resource already exists';
    }
    if (process.env.NODE_ENV === 'production' && statusCode === 500) {
        message = 'Internal server error';
    }
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: error.stack,
            details: error,
        }),
        timestamp: new Date().toISOString(),
        path: req.url,
        method: req.method,
    });
};
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
const notFound = (req, res, next) => {
    const error = new CustomError(`Not found - ${req.originalUrl}`, 404);
    next(error);
};
exports.notFound = notFound;
const badRequest = (message = 'Bad request') => {
    return new CustomError(message, 400);
};
exports.badRequest = badRequest;
const unauthorized = (message = 'Unauthorized') => {
    return new CustomError(message, 401);
};
exports.unauthorized = unauthorized;
const forbidden = (message = 'Forbidden') => {
    return new CustomError(message, 403);
};
exports.forbidden = forbidden;
const notFoundError = (message = 'Resource not found') => {
    return new CustomError(message, 404);
};
exports.notFoundError = notFoundError;
const conflict = (message = 'Resource conflict') => {
    return new CustomError(message, 409);
};
exports.conflict = conflict;
const validationError = (message = 'Validation failed') => {
    return new CustomError(message, 422);
};
exports.validationError = validationError;
const internalError = (message = 'Internal server error') => {
    return new CustomError(message, 500);
};
exports.internalError = internalError;
//# sourceMappingURL=errorHandler.js.map