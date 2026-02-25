import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { setupAuthRoutes } from './routes/authRoutes';
import { setupSeekerRoutes } from './routes/seekerRoutes';
import { setupCompanyRoutes } from './routes/companyRoutes';
import { setupAdminRoutes } from './routes/adminRoutes';
import { setupSocialRoutes } from './routes/socialRoutes';
import { setupNotificationRoutes } from './routes/notificationRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerDocs } from './swagger';

const app = express();

app.use(helmet());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
})); app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use('/uploads', express.static('uploads'));

swaggerDocs(app);

app.use('/api/auth', setupAuthRoutes());
app.use('/api/seeker', setupSeekerRoutes());
app.use('/api/company', setupCompanyRoutes());
app.use('/api/admin', setupAdminRoutes());
app.use('/api/social', setupSocialRoutes());
app.use('/api/notifications', setupNotificationRoutes());

app.use(errorHandler);

export default app;
