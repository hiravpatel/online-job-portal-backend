import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/ApiResponse';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('[Error]:', err.message || err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json(ApiResponse.error(message, statusCode));
};
