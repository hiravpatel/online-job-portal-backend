import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { NotificationService } from '../../application/services/NotificationService';
import { NotificationRepository } from '../../domain/repositories/NotificationRepository';
import { authGuard } from '../middlewares/authMiddleware';
import { AuthService } from '../../infrastructure/services/AuthService';

import { container } from '../../infrastructure/di/container';

const router = Router();

export const setupNotificationRoutes = () => {
    const notificationController = container.notificationController;
    const requireAuth = authGuard(container.externalAuthService);

    router.use(requireAuth);

    router.get('/', notificationController.getMyNotifications);
    router.get('/unread-count', notificationController.getUnreadCount);
    router.patch('/read-all', notificationController.markAllAsRead);
    router.patch('/:notificationId/read', notificationController.markAsRead);

    return router;
};
