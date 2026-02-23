import { Role } from '@prisma/client';
import { prisma } from './prisma';
import { AuthService } from '../services/AuthService';

const DEFAULT_ADMIN_EMAIL = 'admin@jobportal.com';
const DEFAULT_ADMIN_PASSWORD = 'Admin@123';

const isTruthy = (value?: string) => {
    if (!value) return false;
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
};

export const seedAdminUser = async () => {
    const adminEmail = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim();
    const adminPassword = (process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD).trim();
    const forceResetPassword = isTruthy(process.env.ADMIN_FORCE_RESET_PASSWORD);

    if (!adminEmail || !adminPassword) {
        console.warn('[AdminSeeder] Skipped: ADMIN_EMAIL or ADMIN_PASSWORD is empty.');
        return;
    }

    const existing = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    const authService = new AuthService();
    const hashedPassword = await authService.hashPassword(adminPassword);

    if (!existing) {
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                role: Role.ADMIN,
                isVerified: true,
                isBlocked: false
            }
        });
        console.log(`[AdminSeeder] Admin user created (${adminEmail}).`);
        return;
    }

    const updateData: {
        role?: Role;
        isVerified?: boolean;
        isBlocked?: boolean;
        password?: string;
    } = {};

    if (existing.role !== Role.ADMIN) {
        updateData.role = Role.ADMIN;
    }
    if (existing.isBlocked) {
        updateData.isBlocked = false;
    }
    if (!existing.isVerified) {
        updateData.isVerified = true;
    }
    if (forceResetPassword) {
        updateData.password = hashedPassword;
    }

    if (Object.keys(updateData).length > 0) {
        await prisma.user.update({
            where: { id: existing.id },
            data: updateData
        });
        console.log(`[AdminSeeder] Admin user updated (${adminEmail}).`);
    } else {
        console.log(`[AdminSeeder] Admin user already exists (${adminEmail}).`);
    }
};
