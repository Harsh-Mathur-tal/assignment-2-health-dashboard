import { Request, Response, NextFunction } from 'express';
export interface RequestWithId extends Request {
    id?: string;
}
export declare const requestLogger: (req: RequestWithId, res: Response, next: NextFunction) => void;
export declare const logDatabaseQuery: (query: string, params?: any[], duration?: number) => void;
export declare const logExternalApiCall: (service: string, method: string, url: string, statusCode?: number, duration?: number) => void;
export declare const logWebhookReceived: (platform: string, event: string, payload?: any) => void;
export declare const logAlert: (alertType: string, pipelineId: string, severity: string, message: string) => void;
//# sourceMappingURL=requestLogger.d.ts.map