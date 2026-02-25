import { NotificationService } from '../../../application/services/NotificationService';
import { NotificationRepository } from '../../../domain/repositories/NotificationRepository';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('NotificationService', () => {
    let notificationRepositoryMock: DeepMockProxy<NotificationRepository>;
    let notificationService: NotificationService;

    beforeEach(() => {
        notificationRepositoryMock = mockDeep<NotificationRepository>();
        notificationService = new NotificationService(notificationRepositoryMock as any);
    });

    describe('notifyFollow', () => {
        it('should return null if follower and following are identical', async () => {
            const result = await notificationService.notifyFollow('1', '1');
            expect(result).toBeNull();
        });

        it('should create a follow notification', async () => {
            notificationRepositoryMock.createNotification.mockResolvedValueOnce({ id: 'notif-1' } as any);

            const result = await notificationService.notifyFollow('follower-1', 'following-1');

            expect(result).toHaveProperty('id', 'notif-1');
            expect(notificationRepositoryMock.createNotification).toHaveBeenCalledWith(expect.objectContaining({
                recipientId: 'following-1',
                actorId: 'follower-1',
                type: 'FOLLOW'
            }));
        });
    });

    describe('notifyFollowersNewPost', () => {
        it('should accurately distribute notifications ignoring the author', async () => {
            notificationRepositoryMock.getFollowerIds.mockResolvedValueOnce(['user-1', 'author-1', 'user-2']);
            notificationRepositoryMock.createManyNotifications.mockResolvedValueOnce({ count: 2 } as any);

            const result = await notificationService.notifyFollowersNewPost('author-1', 'post-1');

            expect(result).toEqual({ count: 2 });
            expect(notificationRepositoryMock.createManyNotifications).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({ recipientId: 'user-1' }),
                    expect.objectContaining({ recipientId: 'user-2' })
                ])
            );
        });

        it('should handle zero recipients smoothly', async () => {
            notificationRepositoryMock.getFollowerIds.mockResolvedValueOnce(['author-1']);

            const result = await notificationService.notifyFollowersNewPost('author-1', 'post-1');

            expect(result).toEqual({ count: 0 });
            expect(notificationRepositoryMock.createManyNotifications).not.toHaveBeenCalled();
        });
    });

    describe('notifyPostLiked', () => {
        it('should return null if user likes their own post or no author found', async () => {
            notificationRepositoryMock.getPostAuthorId.mockResolvedValueOnce('author-1');
            const result = await notificationService.notifyPostLiked('author-1', 'post-1');
            expect(result).toBeNull();
        });

        it('should notify the author when post is liked', async () => {
            notificationRepositoryMock.getPostAuthorId.mockResolvedValueOnce('author-1');
            notificationRepositoryMock.createNotification.mockResolvedValueOnce({ id: 'notif-1' } as any);

            const result = await notificationService.notifyPostLiked('user-1', 'post-1');

            expect(result).toHaveProperty('id', 'notif-1');
            expect(notificationRepositoryMock.createNotification).toHaveBeenCalledWith(expect.objectContaining({
                recipientId: 'author-1',
                actorId: 'user-1',
                type: 'POST_LIKED'
            }));
        });
    });
});
