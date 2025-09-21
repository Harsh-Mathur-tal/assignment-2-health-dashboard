import { Request, Response, NextFunction } from 'express';
export interface ApiError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
export declare class CustomError extends Error implements ApiError {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number, isOperational?: boolean);
}
export declare const createError: (message: string, statusCode?: number) => CustomError;
export declare const errorHandler: (error: ApiError, req: Request, res: Response, next: NextFunction) => void;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
export declare const notFound: (req: Request, res: Response, next: NextFunction) => void;
export declare const badRequest: (message?: string) => CustomError;
export declare const unauthorized: (message?: string) => CustomError;
export declare const forbidden: (message?: string) => CustomError;
export declare const notFoundError: (message?: string) => CustomError;
export declare const conflict: (message?: string) => CustomError;
export declare const validationError: (message?: string) => CustomError;
export declare const internalError: (message?: string) => CustomError;
//# sourceMappingURL=errorHandler.d.ts.map