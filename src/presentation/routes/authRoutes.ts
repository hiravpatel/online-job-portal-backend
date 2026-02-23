import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthUseCases } from '../../application/use-cases/AuthUseCases';
import { PrismaUserRepository } from '../../infrastructure/database/PrismaUserRepository';
import { AuthService } from '../../infrastructure/services/AuthService';

const router = Router();

export const setupAuthRoutes = () => {
    const userRepository = new PrismaUserRepository();
    const authService = new AuthService();
    const authUseCases = new AuthUseCases(userRepository, authService);
    const authController = new AuthController(authUseCases);

    router.post('/register/seeker', authController.registerSeeker);
    router.post('/register/company', authController.registerCompany);
    router.post('/login', authController.login);

    return router;
};
