import { SocialRepository } from '../../domain/repositories/SocialRepository';
import { IUploadService } from '../interfaces/IUploadService';
import { NotificationService } from './NotificationService';
import { PrismaClient } from '@prisma/client';
import { BadRequestError, NotFoundError, ConflictError, ForbiddenError } from '../../domain/errors/CustomErrors';

const prisma = new PrismaClient(); // Keep for now unless we move to Repositories

export class SocialService {
    constructor(
        private socialRepository: SocialRepository,
        private uploadService: IUploadService,
        private notificationService?: NotificationService
    ) { }

    // ------------------------------------------------------------------------
    // FOLLOW SYSTEM
    // ------------------------------------------------------------------------

    async followUser(followerId: string, followingId: string) {
        if (followerId === followingId) {
            throw new BadRequestError('You cannot follow yourself');
        }

        try {
            const existingFollow = await prisma.follow.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: followerId,
                        followingId: followingId,
                    },
                },
            });

            if (existingFollow) {
                throw new ConflictError('You are already following this user');
            }

            await this.socialRepository.followUser(followerId, followingId);
            await this.safelyNotify(() => this.notificationService?.notifyFollow(followerId, followingId));
            return { message: 'Successfully followed user' };
        } catch (error: any) {
            if (error instanceof ConflictError) {
                throw error;
            }
            throw new BadRequestError('Failed to follow user');
        }
    }

    async unfollowUser(followerId: string, followingId: string) {
        const existing = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: followerId,
                    followingId: followingId,
                },
            },
        });

        if (!existing) {
            throw new BadRequestError('You are not following this user');
        }

        await this.socialRepository.unfollowUser(followerId, followingId);
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
        await this.safelyNotify(() => this.notificationService?.notifyFollowersNewPost(authorId, post.id));
        return post;
    }

    async getPostById(postId: string) {
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) throw new NotFoundError('Post not found');
        return post;
    }

    async deletePost(postId: string, authorId: string) {
        const post = await prisma.post.findFirst({ where: { id: postId, authorId: authorId } });
        if (!post) {
            throw new ForbiddenError('Post not found or you are not authorized to delete it');
        }
        await prisma.post.delete({ where: { id: postId } });
        return { message: 'Post successfully deleted' };
    }

    // ------------------------------------------------------------------------
    // LIKES & COMMENTS
    // ------------------------------------------------------------------------

    async likePost(userId: string, postId: string) {
        // Ensure post exists first
        await this.getPostById(postId);

        try {
            const existingLike = await prisma.like.findUnique({
                where: {
                    postId_userId: {
                        userId: userId,
                        postId: postId,
                    },
                },
            });

            if (existingLike) {
                throw new ConflictError('You already liked this post');
            }

            await this.socialRepository.likePost(userId, postId);
            await this.safelyNotify(() => this.notificationService?.notifyPostLiked(userId, postId));
            return { message: 'Post liked' };
        } catch (error: any) {
            if (error instanceof ConflictError) {
                throw error;
            }
            throw new BadRequestError('Failed to like post');
        }
    }

    async unlikePost(userId: string, postId: string) {
        const existing = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    userId: userId,
                    postId: postId,
                },
            },
        });

        if (!existing) {
            throw new BadRequestError('You have not liked this post');
        }

        await this.socialRepository.unlikePost(userId, postId);
        return { message: 'Post unliked' };
    }

    async addComment(userId: string, postId: string, content: string) {
        // Ensure post exists first
        await this.getPostById(postId);
        const comment = await this.socialRepository.addComment(userId, postId, content);
        await this.safelyNotify(() => this.notificationService?.notifyPostCommented(userId, postId, comment.id));
        return comment;
    }

    async deleteComment(commentId: string, userId: string) {
        const comment = await prisma.comment.findFirst({ where: { id: commentId, userId } });
        if (!comment) {
            throw new ForbiddenError('Comment not found or you are not authorized to delete it');
        }
        await prisma.comment.delete({ where: { id: commentId } });
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
        if (!this.notificationService) {
            return;
        }

        try {
            await fn();
        } catch (error) {
            console.error('[Notification] failed to enqueue notification:', error);
        }
    }
}
