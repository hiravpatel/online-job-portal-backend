import app from './presentation/app';
import dotenv from 'dotenv';
import { prisma } from './infrastructure/database/prisma';
import { NotificationRepository } from './domain/repositories/NotificationRepository';
import { NotificationService } from './application/services/NotificationService';
import { NotificationCronService } from './infrastructure/services/NotificationCronService';
import { seedAdminUser } from './infrastructure/database/adminSeeder';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    let notificationCronService: NotificationCronService | null = null;

    try {
        await prisma.$connect();
        console.log('Connected to MongoDB via Prisma');
        await seedAdminUser();

        const notificationRepository = new NotificationRepository();
        const notificationService = new NotificationService(notificationRepository);
        notificationCronService = new NotificationCronService(
            notificationService,
            Number(process.env.NOTIFICATION_CRON_INTERVAL_MS || 60_000),
            Number(process.env.NOTIFICATION_CRON_BATCH_SIZE || 100)
        );
        notificationCronService.start();

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('Failed to connect to database', error);
        process.exit(1);
    }

    process.on('SIGINT', async () => {
        notificationCronService?.stop();
        await prisma.$disconnect();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        notificationCronService?.stop();
        await prisma.$disconnect();
        process.exit(0);
    });
};

startServer();
