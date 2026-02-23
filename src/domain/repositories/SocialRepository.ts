import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SocialRepository {

    // ------------------------------------------------------------------------
    // FOLLOW SYSTEM
    // ------------------------------------------------------------------------

    async followUser(followerId: string, followingId: string) {
        return await prisma.follow.create({
            data: {
                followerId,
                followingId
            }
        });
    }

    async unfollowUser(followerId: string, followingId: string) {
        return await prisma.follow.deleteMany({
            where: {
                followerId,
                followingId
            }
        });
    }

    async getFollowers(userId: string) {
        return await prisma.follow.findMany({
            where: { followingId: userId },
            include: { follower: { select: { id: true, email: true, seekerProfile: true, companyProfile: true } } }
        });
    }

    async getFollowing(userId: string) {
        return await prisma.follow.findMany({
            where: { followerId: userId },
            include: { following: { select: { id: true, email: true, seekerProfile: true, companyProfile: true } } }
        });
    }

    // ------------------------------------------------------------------------
    // POST SYSTEM
    // ------------------------------------------------------------------------

    async createPost(authorId: string, content: string, imageUrl?: string) {
        return await prisma.post.create({
            data: {
                authorId,
                content,
                imageUrl
            },
            include: {
                author: { select: { id: true, email: true, seekerProfile: true, companyProfile: true } }
            }
        });
    }

    async getPostById(postId: string) {
        return await prisma.post.findUnique({
            where: { id: postId },
            include: {
                author: { select: { id: true, email: true, seekerProfile: true, companyProfile: true } },
                likes: true,
                comments: {
                    include: { user: { select: { id: true, email: true, seekerProfile: true, companyProfile: true } } },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
    }

    async deletePost(postId: string, authorId: string) {
        return await prisma.post.deleteMany({
            where: { id: postId, authorId: authorId } // Ensure the user actually owns the post
        });
    }

    // ------------------------------------------------------------------------
    // LIKES & COMMENTS
    // ------------------------------------------------------------------------

    async likePost(userId: string, postId: string) {
        return await prisma.like.create({
            data: { userId, postId }
        });
    }

    async unlikePost(userId: string, postId: string) {
        return await prisma.like.deleteMany({
            where: { userId, postId }
        });
    }

    async addComment(userId: string, postId: string, content: string) {
        return await prisma.comment.create({
            data: { userId, postId, content },
            include: {
                user: { select: { id: true, seekerProfile: true, companyProfile: true } }
            }
        });
    }

    async deleteComment(commentId: string, userId: string) {
        return await prisma.comment.deleteMany({
            where: { id: commentId, userId } // Ensure user owns the comment
        });
    }

    // ------------------------------------------------------------------------
    // FEED SYSTEM
    // ------------------------------------------------------------------------

    async getFeed(userId: string, page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;

        // Fetch posts from users this user follows, AND their own posts
        const following = await prisma.follow.findMany({
            where: { followerId: userId },
            select: { followingId: true }
        });

        const authorIds = following.map(f => f.followingId);
        authorIds.push(userId);

        return await prisma.post.findMany({
            where: { authorId: { in: authorIds } },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            include: {
                author: { select: { id: true, email: true, role: true, seekerProfile: true, companyProfile: true } },
                _count: { select: { likes: true, comments: true } }
            }
        });
    }

    async getGlobalFeed(page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;
        return await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            include: {
                author: { select: { id: true, email: true, role: true, seekerProfile: true, companyProfile: true } },
                _count: { select: { likes: true, comments: true } }
            }
        });
    }
}
