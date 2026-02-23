import { Router } from 'express';
import { SocialController } from '../controllers/SocialController';
import { SocialUseCases } from '../../application/use-cases/SocialUseCases';
import { SocialRepository } from '../../domain/repositories/SocialRepository';
import { CloudinaryService } from '../../infrastructure/services/CloudinaryService';
import { authGuard } from '../middlewares/authMiddleware';
import { AuthService } from '../../infrastructure/services/AuthService';
import { NotificationRepository } from '../../domain/repositories/NotificationRepository';
import { NotificationUseCases } from '../../application/use-cases/NotificationUseCases';
import multer from 'multer';

// Setup multer for memory storage
const upload = multer({ dest: 'uploads/' }); // Temporary locally stored before Cloudinary upload

const router = Router();
const socialRepository = new SocialRepository();
const uploadService = new CloudinaryService();
const notificationRepository = new NotificationRepository();
const notificationUseCases = new NotificationUseCases(notificationRepository);
const socialUseCases = new SocialUseCases(socialRepository, uploadService, notificationUseCases);
const socialController = new SocialController(socialUseCases);
const authService = new AuthService(); // Real implementation should inject config if needed

const requireAuth = authGuard(authService);

// Feed Routes
router.get('/feed', requireAuth, socialController.getFeed);
router.get('/feed/global', socialController.getGlobalFeed);

// Follow Routes
router.post('/follow/:userId', requireAuth, socialController.followUser);
router.post('/unfollow/:userId', requireAuth, socialController.unfollowUser);
router.get('/followers{/:userId}', requireAuth, socialController.getFollowers);
router.get('/following{/:userId}', requireAuth, socialController.getFollowing);

// Post Routes
router.post('/posts', requireAuth, upload.single('image'), socialController.createPost);
router.get('/posts/:postId', requireAuth, socialController.getPostById);
router.delete('/posts/:postId', requireAuth, socialController.deletePost);

// Like & Comment Routes
router.post('/posts/:postId/like', requireAuth, socialController.likePost);
router.delete('/posts/:postId/like', requireAuth, socialController.unlikePost);
router.post('/posts/:postId/comment', requireAuth, socialController.addComment);
router.delete('/comments/:commentId', requireAuth, socialController.deleteComment);

export default router;
