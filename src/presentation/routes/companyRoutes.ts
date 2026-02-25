import { Router } from 'express';
import multer from 'multer';
import { CompanyController } from '../controllers/CompanyController';
import { CompanyService } from '../../application/services/CompanyService';
import { PrismaUserRepository } from '../../infrastructure/database/PrismaUserRepository';
import { PrismaJobRepository } from '../../infrastructure/database/PrismaJobRepository';
import { PrismaApplicationRepository } from '../../infrastructure/database/PrismaApplicationRepository';
import { CloudinaryService } from '../../infrastructure/services/CloudinaryService';
import { authGuard } from '../middlewares/authMiddleware';
import { roleGuard } from '../middlewares/roleMiddleware';
import { AuthService } from '../../infrastructure/services/AuthService';
import { Role } from '@prisma/client';
import { container } from '../../infrastructure/di/container';

const router = Router();
const upload = multer({ dest: 'uploads/' });

export const setupCompanyRoutes = () => {
    const controller = container.companyController;

    const authMiddleware = authGuard(container.externalAuthService);
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
