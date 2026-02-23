import { prisma } from '../../infrastructure/database/prisma';
import { NotificationType } from '@prisma/client';

export type NotificationTypeValue = NotificationType;

export interface CreateNotificationInput {
    recipientId: string;
    actorId?: string;
    type: NotificationTypeValue;
    title: string;
    message: string;
    entityType?: string;
    entityId?: string;
}

export class NotificationRepository {
    async createNotification(input: CreateNotificationInput) {
        return await prisma.notification.create({
            data: {
                ...input,
                status: 'PENDING'
            }
        });
    }

    async createManyNotifications(inputs: CreateNotificationInput[]) {
        if (inputs.length === 0) {
            return { count: 0 };
        }

        return await prisma.notification.createMany({
            data: inputs.map((input) => ({
                ...input,
                status: 'PENDING'
            }))
        });
    }

    async getFollowerIds(userId: string) {
        const followers = await prisma.follow.findMany({
            where: { followingId: userId },
            select: { followerId: true }
        });

        return followers.map((f) => f.followerId);
    }

    async getPostAuthorId(postId: string) {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { authorId: true }
        });

        return post?.authorId ?? null;
    }

    async getUserNotifications(userId: string, page: number = 1, limit: number = 20, unreadOnly: boolean = false) {
        const skip = (page - 1) * limit;
        const where = {
            recipientId: userId,
            ...(unreadOnly ? { isRead: false } : {})
        };

        const [items, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    actor: {
                        select: {
                            id: true,
                            email: true,
                            seekerProfile: true,
                            companyProfile: true
                        }
                    }
                }
            }),
            prisma.notification.count({ where })
        ]);

        return {
            items,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getUnreadCount(userId: string) {
        const unreadCount = await prisma.notification.count({
            where: {
                recipientId: userId,
                isRead: false
            }
        });

        return { unreadCount };
    }

    async markAsRead(userId: string, notificationId: string) {
        const result = await prisma.notification.updateMany({
            where: {
                id: notificationId,
                recipientId: userId,
                isRead: false
            },
            data: {
                isRead: true,
                readAt: new Date()
            }
        });

        if (result.count === 0) {
            const error: any = new Error('Notification not found');
            error.statusCode = 404;
            throw error;
        }

        return { message: 'Notification marked as read' };
    }

    async markAllAsRead(userId: string) {
        const result = await prisma.notification.updateMany({
            where: {
                recipientId: userId,
                isRead: false
            },
            data: {
                isRead: true,
                readAt: new Date()
            }
        });

        return { updatedCount: result.count };
    }

    async getPendingNotifications(limit: number = 100) {
        return await prisma.notification.findMany({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'asc' },
            take: limit
        });
    }

    async markNotificationsSent(notificationIds: string[]) {
        if (notificationIds.length === 0) {
            return { count: 0 };
        }

        return await prisma.notification.updateMany({
            where: {
                id: { in: notificationIds }
            },
            data: {
                status: 'SENT',
                sentAt: new Date()
            }
        });
    }

    async markNotificationsFailed(notificationIds: string[], reason: string) {
        if (notificationIds.length === 0) {
            return { count: 0 };
        }

        return await prisma.notification.updateMany({
            where: {
                id: { in: notificationIds }
            },
            data: {
                status: 'FAILED',
                deliveryError: reason
            }
        });
    }
}
