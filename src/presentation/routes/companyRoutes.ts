import { Router } from 'express';
import multer from 'multer';
import { CompanyController } from '../controllers/CompanyController';
import { CompanyUseCases } from '../../application/use-cases/CompanyUseCases';
import { PrismaUserRepository } from '../../infrastructure/database/PrismaUserRepository';
import { PrismaJobRepository } from '../../infrastructure/database/PrismaJobRepository';
import { PrismaApplicationRepository } from '../../infrastructure/database/PrismaApplicationRepository';
import { CloudinaryService } from '../../infrastructure/services/CloudinaryService';
import { authGuard } from '../middlewares/authMiddleware';
import { roleGuard } from '../middlewares/roleMiddleware';
import { AuthService } from '../../infrastructure/services/AuthService';
import { Role } from '@prisma/client';

const router = Router();
const upload = multer({ dest: 'uploads/' });

export const setupCompanyRoutes = () => {
    const userRepository = new PrismaUserRepository();
    const jobRepository = new PrismaJobRepository();
    const appRepository = new PrismaApplicationRepository();
    const uploadService = new CloudinaryService();
    const authService = new AuthService();

    const useCases = new CompanyUseCases(userRepository, jobRepository, appRepository, uploadService);
    const controller = new CompanyController(useCases);

    const authMiddleware = authGuard(authService);
    const companyOnly = roleGuard([Role.COMPANY]);

    router.use(authMiddleware);

    // Public route (accessible by any authenticated user, like Seekers)
    router.get('/profile/public/:userId', controller.getPublicProfile);
    router.get('/all', controller.getAllCompanies);

    // Company only routes
    router.use(companyOnly);

    router.get('/profile', controller.getProfile);
    router.put('/profile', controller.updateProfile);
    router.post('/profile/logo', upload.single('logo'), controller.uploadLogo);

    router.post('/jobs', controller.postJob);
    router.put('/jobs/:jobId', controller.updateJob);
    router.get('/jobs', controller.getCompanyJobs);

    router.get('/jobs/:jobId/applications', controller.getJobApplications);
    router.put('/applications/:appId', controller.updateApplicationStatus);

    return router;
};
