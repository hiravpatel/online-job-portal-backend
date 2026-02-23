import { Router } from 'express';
import multer from 'multer';
import { SeekerController } from '../controllers/SeekerController';
import { SeekerUseCases } from '../../application/use-cases/SeekerUseCases';
import { PrismaUserRepository } from '../../infrastructure/database/PrismaUserRepository';
import { PrismaJobRepository } from '../../infrastructure/database/PrismaJobRepository';
import { PrismaApplicationRepository } from '../../infrastructure/database/PrismaApplicationRepository';
import { CloudinaryService } from '../../infrastructure/services/CloudinaryService';
import { authGuard } from '../middlewares/authMiddleware';
import { roleGuard } from '../middlewares/roleMiddleware';
import { AuthService } from '../../infrastructure/services/AuthService';
import { Role } from '@prisma/client';

const router = Router();
const upload = multer({ dest: 'uploads/' }); // Simple setup for local uploads

export const setupSeekerRoutes = () => {
    const userRepository = new PrismaUserRepository();
    const jobRepository = new PrismaJobRepository();
    const appRepository = new PrismaApplicationRepository();
    const uploadService = new CloudinaryService();
    const authService = new AuthService();

    const useCases = new SeekerUseCases(userRepository, jobRepository, appRepository, uploadService);
    const controller = new SeekerController(useCases);

    const authMiddleware = authGuard(authService);
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
