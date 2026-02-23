import { Response, NextFunction } from 'express';
import { NotificationUseCases } from '../../application/use-cases/NotificationUseCases';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { ApiResponse } from '../utils/ApiResponse';

export class NotificationController {
    constructor(private notificationUseCases: NotificationUseCases) { }

    getMyNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const { page, limit, unreadOnly } = req.query;

            const data = await this.notificationUseCases.getMyNotifications(
                userId,
                page ? parseInt(page as string, 10) : 1,
                limit ? parseInt(limit as string, 10) : 20,
                unreadOnly === 'true'
            );

            res.status(200).json(ApiResponse.success(data, 'Notifications retrieved successfully'));
        } catch (error) {
            next(error);
        }
    };

    getUnreadCount = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const count = await this.notificationUseCases.getUnreadCount(userId);
            res.status(200).json(ApiResponse.success(count, 'Unread count retrieved successfully'));
        } catch (error) {
            next(error);
        }
    };

    markAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const notificationId = req.params.notificationId as string;
            const result = await this.notificationUseCases.markAsRead(userId, notificationId);
            res.status(200).json(ApiResponse.success(result));
        } catch (error) {
            next(error);
        }
    };

    markAllAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const result = await this.notificationUseCases.markAllAsRead(userId);
            res.status(200).json(ApiResponse.success(result, 'All notifications marked as read'));
        } catch (error) {
            next(error);
        }
    };
}
