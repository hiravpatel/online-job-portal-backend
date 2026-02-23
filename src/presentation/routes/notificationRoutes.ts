import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { NotificationUseCases } from '../../application/use-cases/NotificationUseCases';
import { NotificationRepository } from '../../domain/repositories/NotificationRepository';
import { authGuard } from '../middlewares/authMiddleware';
import { AuthService } from '../../infrastructure/services/AuthService';

const router = Router();

export const setupNotificationRoutes = () => {
    const notificationRepository = new NotificationRepository();
    const notificationUseCases = new NotificationUseCases(notificationRepository);
    const notificationController = new NotificationController(notificationUseCases);

    const authService = new AuthService();
    const requireAuth = authGuard(authService);

    router.use(requireAuth);

    router.get('/', notificationController.getMyNotifications);
    router.get('/unread-count', notificationController.getUnreadCount);
    router.patch('/read-all', notificationController.markAllAsRead);
    router.patch('/:notificationId/read', notificationController.markAsRead);

    return router;
};
