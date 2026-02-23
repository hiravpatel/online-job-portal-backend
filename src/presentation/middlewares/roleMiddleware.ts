import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware';
import { ApiResponse } from '../utils/ApiResponse';

export const roleGuard = (roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json(ApiResponse.error('Forbidden. Insufficient permissions', 403));
        }
        next();
    };
};
