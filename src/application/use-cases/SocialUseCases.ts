import { SocialRepository } from '../../domain/repositories/SocialRepository';
import { IUploadService } from '../interfaces/IUploadService';
import { NotificationUseCases } from './NotificationUseCases';

export class SocialUseCases {
    constructor(
        private socialRepository: SocialRepository,
        private uploadService: IUploadService,
        private notificationUseCases?: NotificationUseCases
    ) { }

    // ------------------------------------------------------------------------
    // FOLLOW SYSTEM
    // ------------------------------------------------------------------------

    async followUser(followerId: string, followingId: string) {
        if (followerId === followingId) {
            throw new Error('You cannot follow yourself');
        }

        try {
            await this.socialRepository.followUser(followerId, followingId);
            await this.safelyNotify(() => this.notificationUseCases?.notifyFollow(followerId, followingId));
            return { message: 'Successfully followed user' };
        } catch (error: any) {
            if (error.code === 'P2002') { // Prisma unique constraint violation
                throw new Error('You are already following this user');
            }
            throw new Error('Failed to follow user');
        }
    }

    async unfollowUser(followerId: string, followingId: string) {
        const result = await this.socialRepository.unfollowUser(followerId, followingId);
        if (result.count === 0) {
            throw new Error('You are not following this user');
        }
        return { message: 'Successfully unfollowed user' };
    }

    async getFollowers(userId: string) {
        return await this.socialRepository.getFollowers(userId);
    }

    async getFollowing(userId: string) {
        return await this.socialRepository.getFollowing(userId);
    }

    // ------------------------------------------------------------------------
    // POST SYSTEM
    // ------------------------------------------------------------------------

    async createPost(authorId: string, content: string, imageFile?: any) {
        let imageUrl = undefined;
        if (imageFile) {
            imageUrl = await this.uploadService.uploadFile(imageFile, 'posts');
        }

        const post = await this.socialRepository.createPost(authorId, content, imageUrl);
        await this.safelyNotify(() => this.notificationUseCases?.notifyFollowersNewPost(authorId, post.id));
        return post;
    }

    async getPostById(postId: string) {
        const post = await this.socialRepository.getPostById(postId);
        if (!post) throw new Error('Post not found');
        return post;
    }

    async deletePost(postId: string, authorId: string) {
        const result = await this.socialRepository.deletePost(postId, authorId);
        if (result.count === 0) {
            throw new Error('Post not found or you are not authorized to delete it');
        }
        return { message: 'Post successfully deleted' };
    }

    // ------------------------------------------------------------------------
    // LIKES & COMMENTS
    // ------------------------------------------------------------------------

    async likePost(userId: string, postId: string) {
        // Ensure post exists first
        await this.getPostById(postId);

        try {
            await this.socialRepository.likePost(userId, postId);
            await this.safelyNotify(() => this.notificationUseCases?.notifyPostLiked(userId, postId));
            return { message: 'Post liked' };
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new Error('You already liked this post');
            }
            throw new Error('Failed to like post');
        }
    }

    async unlikePost(userId: string, postId: string) {
        const result = await this.socialRepository.unlikePost(userId, postId);
        if (result.count === 0) {
            throw new Error('You have not liked this post');
        }
        return { message: 'Post unliked' };
    }

    async addComment(userId: string, postId: string, content: string) {
        // Ensure post exists first
        await this.getPostById(postId);
        const comment = await this.socialRepository.addComment(userId, postId, content);
        await this.safelyNotify(() => this.notificationUseCases?.notifyPostCommented(userId, postId, comment.id));
        return comment;
    }

    async deleteComment(commentId: string, userId: string) {
        const result = await this.socialRepository.deleteComment(commentId, userId);
        if (result.count === 0) {
            throw new Error('Comment not found or you are not authorized to delete it');
        }
        return { message: 'Comment successfully deleted' };
    }

    // ------------------------------------------------------------------------
    // FEED SYSTEM
    // ------------------------------------------------------------------------

    async getFeed(userId: string, page: number = 1, limit: number = 20) {
        return await this.socialRepository.getFeed(userId, page, limit);
    }

    async getGlobalFeed(page: number = 1, limit: number = 20) {
        return await this.socialRepository.getGlobalFeed(page, limit);
    }

    private async safelyNotify(fn: () => Promise<unknown> | undefined) {
        if (!this.notificationUseCases) {
            return;
        }

        try {
            await fn();
        } catch (error) {
            console.error('[Notification] failed to enqueue notification:', error);
        }
    }
}
