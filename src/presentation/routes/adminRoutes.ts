import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { AdminUseCases } from '../../application/use-cases/AdminUseCases';
import { PrismaUserRepository } from '../../infrastructure/database/PrismaUserRepository';
import { PrismaJobRepository } from '../../infrastructure/database/PrismaJobRepository';
import { authGuard } from '../middlewares/authMiddleware';
import { roleGuard } from '../middlewares/roleMiddleware';
import { AuthService } from '../../infrastructure/services/AuthService';
import { Role } from '@prisma/client';

const router = Router();

export const setupAdminRoutes = () => {
    const userRepository = new PrismaUserRepository();
    const jobRepository = new PrismaJobRepository();
    const authService = new AuthService();

    const useCases = new AdminUseCases(userRepository, jobRepository);
    const controller = new AdminController(useCases);

    const authMiddleware = authGuard(authService);
    const adminOnly = roleGuard([Role.ADMIN]);

    router.use(authMiddleware);
    router.use(adminOnly);

    router.get('/users', controller.getAllUsers);
    router.put('/users/:userId/block', controller.toggleUserBlockStatus);

    router.get('/jobs/pending', controller.getPendingJobs);
    router.put('/jobs/:jobId/approve', controller.approveJob);
    router.put('/jobs/:jobId/reject', controller.rejectJob);

    return router;
};
