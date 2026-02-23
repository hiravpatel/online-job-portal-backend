import {
    NotificationRepository,
    NotificationTypeValue
} from '../../domain/repositories/NotificationRepository';

export class NotificationUseCases {
    constructor(private notificationRepository: NotificationRepository) { }

    async notifyUser(input: {
        recipientId: string;
        actorId?: string;
        type: NotificationTypeValue;
        title: string;
        message: string;
        entityType?: string;
        entityId?: string;
    }) {
        if (!input.recipientId) {
            return null;
        }

        return await this.notificationRepository.createNotification(input);
    }

    async notifyFollow(followerId: string, followingId: string) {
        if (followerId === followingId) {
            return null;
        }

        return await this.notifyUser({
            recipientId: followingId,
            actorId: followerId,
            type: 'FOLLOW',
            title: 'New follower',
            message: 'Someone started following you.',
            entityType: 'USER',
            entityId: followerId
        });
    }

    async notifyFollowersNewPost(authorId: string, postId: string) {
        const followerIds = await this.notificationRepository.getFollowerIds(authorId);
        const recipients = followerIds.filter((id) => id !== authorId);

        if (recipients.length === 0) {
            return { count: 0 };
        }

        return await this.notificationRepository.createManyNotifications(
            recipients.map((recipientId) => ({
                recipientId,
                actorId: authorId,
                type: 'NEW_POST',
                title: 'New post from someone you follow',
                message: 'A user you follow published a new post.',
                entityType: 'POST',
                entityId: postId
            }))
        );
    }

    async notifyPostLiked(userId: string, postId: string) {
        const postAuthorId = await this.notificationRepository.getPostAuthorId(postId);
        if (!postAuthorId || postAuthorId === userId) {
            return null;
        }

        return await this.notifyUser({
            recipientId: postAuthorId,
            actorId: userId,
            type: 'POST_LIKED',
            title: 'Your post got a like',
            message: 'Someone liked your post.',
            entityType: 'POST',
            entityId: postId
        });
    }

    async notifyPostCommented(userId: string, postId: string, commentId: string) {
        const postAuthorId = await this.notificationRepository.getPostAuthorId(postId);
        if (!postAuthorId || postAuthorId === userId) {
            return null;
        }

        return await this.notifyUser({
            recipientId: postAuthorId,
            actorId: userId,
            type: 'POST_COMMENTED',
            title: 'New comment on your post',
            message: 'Someone commented on your post.',
            entityType: 'COMMENT',
            entityId: commentId
        });
    }

    async getMyNotifications(userId: string, page: number = 1, limit: number = 20, unreadOnly: boolean = false) {
        return await this.notificationRepository.getUserNotifications(userId, page, limit, unreadOnly);
    }

    async getUnreadCount(userId: string) {
        return await this.notificationRepository.getUnreadCount(userId);
    }

    async markAsRead(userId: string, notificationId: string) {
        return await this.notificationRepository.markAsRead(userId, notificationId);
    }

    async markAllAsRead(userId: string) {
        return await this.notificationRepository.markAllAsRead(userId);
    }

    async processPendingNotifications(batchSize: number = 100) {
        const pending = await this.notificationRepository.getPendingNotifications(batchSize);
        if (pending.length === 0) {
            return { processed: 0, failed: 0 };
        }

        const sentIds: string[] = [];
        const failedIds: string[] = [];

        for (const notification of pending) {
            try {
                await this.deliverNotification(notification);
                sentIds.push(notification.id);
            } catch (error) {
                failedIds.push(notification.id);
            }
        }

        await this.notificationRepository.markNotificationsSent(sentIds);
        await this.notificationRepository.markNotificationsFailed(failedIds, 'Failed to deliver notification');

        return {
            processed: sentIds.length,
            failed: failedIds.length
        };
    }

    private async deliverNotification(notification: any) {
        // Placeholder delivery channel. This can be replaced with email, push, websocket, etc.
        console.log(
            `[NotificationDelivery] id=${notification.id} recipient=${notification.recipientId} type=${notification.type}`
        );
    }
}
