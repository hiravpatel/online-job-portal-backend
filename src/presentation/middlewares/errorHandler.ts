import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { AppError } from '../../domain/errors/AppError';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Structured error logging
    const errorLog = {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    };

    if (err instanceof AppError) {
        if (!err.isOperational) {
            console.error('[Critical Error]:', errorLog);
        } else {
            console.warn('[Operational Error]:', err.message);
        }
        res.status(err.statusCode).json(ApiResponse.error(err.message, err.statusCode));
        return;
    }

    // Unhandled or severe errors
    console.error('[Unhandled Error]:', errorLog);
    res.status(500).json(ApiResponse.error('Internal Server Error', 500));
};
