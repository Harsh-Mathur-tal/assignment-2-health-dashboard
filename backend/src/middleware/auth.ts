import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../types';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token required',
        message: 'Please provide a valid access token in the Authorization header',
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error('JWT_SECRET not configured');
      res.status(500).json({
        success: false,
        error: 'Server configuration error',
      });
      return;
    }

    // Verify the token
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // In a real application, you would fetch the user from the database
    // For now, we'll construct the user from the token payload
    const user: User = {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      role: decoded.role,
      isActive: decoded.isActive,
      createdAt: new Date(decoded.createdAt),
      updatedAt: new Date(decoded.updatedAt),
    };

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'The provided token is invalid or expired',
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: 'Token expired',
        message: 'The provided token has expired',
      });
      return;
    }

    logger.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
      message: 'An error occurred during authentication',
    });
  }
};

export const requireRole = (requiredRole: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    if (req.user.role !== requiredRole && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        message: `This action requires ${requiredRole} role or higher`,
      });
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole('admin');

export const generateToken = (user: User): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }

  const payload = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  const options = {
    expiresIn: process.env.JWT_EXPIRE_TIME || '1h',
    issuer: 'cicd-dashboard',
    audience: 'cicd-dashboard-users',
  } as any;
  
  return jwt.sign(payload, jwtSecret, options);
};

export const generateRefreshToken = (user: User): string => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!refreshSecret) {
    throw new Error('JWT_REFRESH_SECRET not configured');
  }

  const refreshOptions = {
    expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME || '7d',
    issuer: 'cicd-dashboard',
    audience: 'cicd-dashboard-users',
  } as any;
  
  return jwt.sign(
    { id: user.id, email: user.email },
    refreshSecret,
    refreshOptions
  );
};

export const verifyRefreshToken = (token: string): any => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!refreshSecret) {
    throw new Error('JWT_REFRESH_SECRET not configured');
  }

  return jwt.verify(token, refreshSecret);
};
