import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { container } from '../../infrastructure/di/container';

const router = Router();

export const setupAuthRoutes = () => {
    const authController = container.authController;

    router.post('/register/seeker', authController.registerSeeker);
    router.post('/register/company', authController.registerCompany);
    router.post('/login', authController.login);
    router.post('/forgot-password', authController.forgotPassword);
    router.post('/reset-password', authController.resetPassword);

    return router;
};
