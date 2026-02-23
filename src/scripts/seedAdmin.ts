import dotenv from 'dotenv';
import { prisma } from '../infrastructure/database/prisma';
import { seedAdminUser } from '../infrastructure/database/adminSeeder';

dotenv.config();

const run = async () => {
    try {
        await prisma.$connect();
        await seedAdminUser();
    } catch (error) {
        console.error('[AdminSeeder] Failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
};

run();
