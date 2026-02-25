import { Router } from 'express';
import multer from 'multer';
import { SeekerController } from '../controllers/SeekerController';
import { SeekerService } from '../../application/services/SeekerService';
import { PrismaUserRepository } from '../../infrastructure/database/PrismaUserRepository';
import { PrismaJobRepository } from '../../infrastructure/database/PrismaJobRepository';
import { PrismaApplicationRepository } from '../../infrastructure/database/PrismaApplicationRepository';
import { CloudinaryService } from '../../infrastructure/services/CloudinaryService';
import { authGuard } from '../middlewares/authMiddleware';
import { roleGuard } from '../middlewares/roleMiddleware';
import { AuthService } from '../../infrastructure/services/AuthService';
import { Role } from '@prisma/client';
import { container } from '../../infrastructure/di/container';

export const setupSeekerRoutes = () => {
    const router = Router();
    const upload = multer({ dest: 'uploads/' }); // Simple setup for local uploads

    const controller = container.seekerController;

    const authMiddleware = authGuard(container.externalAuthService);
    const seekerOnly = roleGuard([Role.SEEKER]);

    router.use(authMiddleware);

    // Public route for any authenticated user
    router.get('/profile/public/:userId', controller.getPublicProfile);

    // Seeker only routes
    router.use(seekerOnly);

    router.get('/profile', controller.getProfile);
    router.put('/profile', controller.updateProfile);
    router.post('/profile/photo', upload.single('photo'), controller.uploadPhoto);

    router.get('/jobs', controller.searchJobs);
    router.post('/jobs/:jobId/apply', upload.single('resume'), controller.applyForJob);

    router.get('/applications', controller.getMyApplications);

    return router;
};
