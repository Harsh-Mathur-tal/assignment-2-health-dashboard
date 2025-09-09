import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export interface RequestWithId extends Request {
  id?: string;
}

export const requestLogger = (req: RequestWithId, res: Response, next: NextFunction): void => {
  // Generate unique request ID
  req.id = uuidv4();

  // Start timer
  const startTime = Date.now();

  // Log incoming request
  logger.info('Incoming request', {
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

  // Log request body for non-GET requests (excluding sensitive data)
  if (req.method !== 'GET' && req.body) {
    const sanitizedBody = sanitizeRequestBody(req.body, req.path);
    if (Object.keys(sanitizedBody).length > 0) {
      logger.debug('Request body', {
        requestId: req.id,
        body: sanitizedBody,
      });
    }
  }

  // Capture the original res.end method
  const originalEnd = res.end;

  // Override res.end to log response
  res.end = function(chunk?: any, encoding?: any): Response {
    const duration = Date.now() - startTime;
    
    // Log response
    logger.info('Request completed', {
      requestId: req.id,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length'),
      timestamp: new Date().toISOString(),
    });

    // Log slow requests
    if (duration > 1000) {
      logger.warn('Slow request detected', {
        requestId: req.id,
        method: req.method,
        url: req.url,
        duration: `${duration}ms`,
      });
    }

    // Call the original res.end method
    return originalEnd.call(this, chunk, encoding);
  };

  next();
};

const sanitizeRequestBody = (body: any, path: string): any => {
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

  // Don't log body for sensitive routes
  if (sensitiveRoutes.some(route => path.includes(route))) {
    return { '[REDACTED]': 'Sensitive data not logged' };
  }

  // Recursively sanitize object
  const sanitized: any = {};

  for (const [key, value] of Object.entries(body)) {
    const lowerKey = key.toLowerCase();
    
    if (sensitiveFields.some(field => lowerKey.includes(field))) {
      sanitized[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeRequestBody(value, path);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

export const logDatabaseQuery = (query: string, params?: any[], duration?: number): void => {
  logger.debug('Database query', {
    query: query.replace(/\s+/g, ' ').trim(),
    params: params?.map(param => 
      typeof param === 'string' && param.length > 100 
        ? `${param.substring(0, 100)}...` 
        : param
    ),
    duration: duration ? `${duration}ms` : undefined,
    timestamp: new Date().toISOString(),
  });
};

export const logExternalApiCall = (
  service: string, 
  method: string, 
  url: string, 
  statusCode?: number, 
  duration?: number
): void => {
  logger.info('External API call', {
    service,
    method,
    url,
    statusCode,
    duration: duration ? `${duration}ms` : undefined,
    timestamp: new Date().toISOString(),
  });
};

export const logWebhookReceived = (
  platform: string, 
  event: string, 
  payload?: any
): void => {
  logger.info('Webhook received', {
    platform,
    event,
    payloadSize: payload ? JSON.stringify(payload).length : 0,
    timestamp: new Date().toISOString(),
  });
};

export const logAlert = (
  alertType: string, 
  pipelineId: string, 
  severity: string, 
  message: string
): void => {
  logger.warn('Alert triggered', {
    alertType,
    pipelineId,
    severity,
    message,
    timestamp: new Date().toISOString(),
  });
};
