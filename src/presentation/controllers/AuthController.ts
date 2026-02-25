import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/services/AuthService';
import { ApiResponse } from '../utils/ApiResponse';

export class AuthController {
    constructor(private authService: AuthService) { }

    registerSeeker = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.authService.registerSeeker(req.body);
            res.status(201).json(ApiResponse.created(result, 'Seeker registered successfully'));
        } catch (error: any) {
            if (error.message === 'Email already in use') error.statusCode = 400;
            next(error);
        }
    };

    registerCompany = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.authService.registerCompany(req.body);
            res.status(201).json(ApiResponse.created(result, 'Company registered successfully'));
        } catch (error: any) {
            if (error.message === 'Email already in use') error.statusCode = 400;
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.status(200).json(ApiResponse.success(result, 'Login successful'));
        } catch (error: any) {
            if (error.message === 'Invalid credentials' || error.message.includes('blocked')) {
                error.statusCode = 401;
            }
            next(error);
        }
    };

    forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json(ApiResponse.error('Email is required', 400));
            }
            const result = await this.authService.forgotPassword(email);
            res.status(200).json(ApiResponse.success(result, result.message));
        } catch (error: any) {
            next(error);
        }
    };

    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token, newPassword } = req.body;
            if (!token || !newPassword) {
                return res.status(400).json(ApiResponse.error('Token and new password are required', 400));
            }
            const result = await this.authService.resetPassword(token, newPassword);
            res.status(200).json(ApiResponse.success(result, result.message));
        } catch (error: any) {
            next(error);
        }
    };
}
