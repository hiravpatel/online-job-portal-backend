import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { AdminService } from '../../application/services/AdminService';
import { PrismaUserRepository } from '../../infrastructure/database/PrismaUserRepository';
import { PrismaJobRepository } from '../../infrastructure/database/PrismaJobRepository';
import { authGuard } from '../middlewares/authMiddleware';
import { roleGuard } from '../middlewares/roleMiddleware';
import { AuthService } from '../../infrastructure/services/AuthService';
import { Role } from '@prisma/client';
import { container } from '../../infrastructure/di/container';

const router = Router();

export const setupAdminRoutes = () => {
    const controller = container.adminController;

    const authMiddleware = authGuard(container.externalAuthService);
    const adminOnly = roleGuard([Role.ADMIN]);

    router.use(authMiddleware);
    router.use(adminOnly);

    router.get('/users', controller.getAllUsers);
    router.put('/users/:userId/block', controller.toggleUserBlockStatus);

    router.get('/jobs/pending', controller.getPendingJobs);
    router.put('/jobs/:jobId/approve', controller.approveJob);
    router.put('/jobs/:jobId/reject', controller.rejectJob);

    router.get('/companies', controller.getAllCompanies);
    router.get('/companies/pending', controller.getPendingCompanies);
    router.put('/company/:userId/approve', controller.approveCompany);

    return router;
};
