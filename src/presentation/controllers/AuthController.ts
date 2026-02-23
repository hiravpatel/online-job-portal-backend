import { Request, Response, NextFunction } from 'express';
import { AuthUseCases } from '../../application/use-cases/AuthUseCases';
import { ApiResponse } from '../utils/ApiResponse';

export class AuthController {
    constructor(private authUseCases: AuthUseCases) { }

    registerSeeker = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.authUseCases.registerSeeker(req.body);
            res.status(201).json(ApiResponse.created(result, 'Seeker registered successfully'));
        } catch (error: any) {
            if (error.message === 'Email already in use') error.statusCode = 400;
            next(error);
        }
    };

    registerCompany = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.authUseCases.registerCompany(req.body);
            res.status(201).json(ApiResponse.created(result, 'Company registered successfully'));
        } catch (error: any) {
            if (error.message === 'Email already in use') error.statusCode = 400;
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const result = await this.authUseCases.login(email, password);
            res.status(200).json(ApiResponse.success(result, 'Login successful'));
        } catch (error: any) {
            if (error.message === 'Invalid credentials' || error.message.includes('blocked')) {
                error.statusCode = 401;
            }
            next(error);
        }
    };
}
