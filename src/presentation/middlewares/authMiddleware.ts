import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../../application/interfaces/IAuthService';
import { ApiResponse } from '../utils/ApiResponse';

export interface AuthenticatedRequest extends Request {
    user?: { id: string; role: string };
}

export const authGuard = (authService: IAuthService) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json(ApiResponse.error('Unauthorized', 401));
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = authService.verifyToken(token);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json(ApiResponse.error('Invalid or expired token', 401));
        }
    };
};
