import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { SocialUseCases } from '../../application/use-cases/SocialUseCases';
import { ApiResponse } from '../utils/ApiResponse';

export class SocialController {
    constructor(private socialUseCases: SocialUseCases) { }

    // ------------------------------------------------------------------------
    // FOLLOW SYSTEM
    // ------------------------------------------------------------------------

    followUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const followerId = req.user!.id; // Current user
            const followingId = req.params.userId as string; // User to follow

            const result = await this.socialUseCases.followUser(followerId, followingId);
            res.status(200).json(ApiResponse.success(result));
        } catch (error) {
            next(error);
        }
    };

    unfollowUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const followerId = req.user!.id; // Current user
            const followingId = req.params.userId as string; // User to unfollow

            const result = await this.socialUseCases.unfollowUser(followerId, followingId);
            res.status(200).json(ApiResponse.success(result));
        } catch (error) {
            next(error);
        }
    };

    getFollowers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = (req.params.userId as string) || req.user!.id;
            const followers = await this.socialUseCases.getFollowers(userId);
            res.status(200).json(ApiResponse.success(followers));
        } catch (error) {
            next(error);
        }
    };

    getFollowing = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = (req.params.userId as string) || req.user!.id;
            const following = await this.socialUseCases.getFollowing(userId);
            res.status(200).json(ApiResponse.success(following));
        } catch (error) {
            next(error);
        }
    };

    // ------------------------------------------------------------------------
    // POST SYSTEM
    // ------------------------------------------------------------------------

    createPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const authorId = req.user!.id;
            const { content } = req.body;
            const file = req.file;

            if (!content && !file) {
                return res.status(400).json(ApiResponse.error('Post content or image is required', 400));
            }

            const post = await this.socialUseCases.createPost(authorId, content, file);
            res.status(201).json(ApiResponse.created(post, 'Post created successfully'));
        } catch (error) {
            next(error);
        }
    };

    getPostById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const postId = req.params.postId as string;
            const post = await this.socialUseCases.getPostById(postId);
            res.status(200).json(ApiResponse.success(post));
        } catch (error) {
            next(error);
        }
    };

    deletePost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const postId = req.params.postId as string;
            const authorId = req.user!.id;
            const result = await this.socialUseCases.deletePost(postId, authorId);
            res.status(200).json(ApiResponse.success(result));
        } catch (error) {
            next(error);
        }
    };

    // ------------------------------------------------------------------------
    // LIKES & COMMENTS
    // ------------------------------------------------------------------------

    likePost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const postId = req.params.postId as string;
            const result = await this.socialUseCases.likePost(userId, postId);
            res.status(200).json(ApiResponse.success(result));
        } catch (error) {
            next(error);
        }
    };

    unlikePost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const postId = req.params.postId as string;
            const result = await this.socialUseCases.unlikePost(userId, postId);
            res.status(200).json(ApiResponse.success(result));
        } catch (error) {
            next(error);
        }
    };

    addComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const postId = req.params.postId as string;
            const { content } = req.body;

            if (!content) {
                return res.status(400).json(ApiResponse.error('Comment content is required', 400));
            }

            const comment = await this.socialUseCases.addComment(userId, postId, content);
            res.status(201).json(ApiResponse.created(comment, 'Comment added successfully'));
        } catch (error) {
            next(error);
        }
    };

    deleteComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const commentId = req.params.commentId as string;
            const result = await this.socialUseCases.deleteComment(commentId, userId);
            res.status(200).json(ApiResponse.success(result));
        } catch (error) {
            next(error);
        }
    };

    // ------------------------------------------------------------------------
    // FEED SYSTEM
    // ------------------------------------------------------------------------

    getFeed = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const { page, limit } = req.query;
            const feed = await this.socialUseCases.getFeed(
                userId,
                page ? parseInt(page as string) : 1,
                limit ? parseInt(limit as string) : 20
            );
            res.status(200).json(ApiResponse.success(feed));
        } catch (error) {
            next(error);
        }
    };

    getGlobalFeed = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { page, limit } = req.query;
            const feed = await this.socialUseCases.getGlobalFeed(
                page ? parseInt(page as string) : 1,
                limit ? parseInt(limit as string) : 20
            );
            res.status(200).json(ApiResponse.success(feed));
        } catch (error) {
            next(error);
        }
    };
}
