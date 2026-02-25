import { UserRepository } from '../../domain/repositories/UserRepository';
import { User, SeekerProfile, CompanyProfile, Role } from '@prisma/client';
import { prisma } from './prisma';

export class PrismaUserRepository implements UserRepository {
    async createSeeker(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>, profileData: Omit<SeekerProfile, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<User> {
        return await prisma.user.create({
            data: {
                ...userData,
                seekerProfile: {
                    create: profileData
                }
            },
            include: {
                seekerProfile: true
            }
        });
    }

    async createCompany(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>, profileData: Omit<CompanyProfile, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<User> {
        return await prisma.user.create({
            data: {
                ...userData,
                companyProfile: {
                    create: profileData
                }
            },
            include: {
                companyProfile: true
            }
        });
    }

    async createAdmin(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        return await prisma.user.create({
            data: userData
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({ where: { email } });
    }

    async findById(id: string): Promise<User | null> {
        return await prisma.user.findUnique({ where: { id } });
    }

    async findByResetPasswordToken(token: string): Promise<User | null> {
        return await prisma.user.findFirst({ where: { resetPasswordToken: token } });
    }

    async updateUserResetToken(userId: string, token: string | null, expires: Date | null): Promise<User> {
        return await prisma.user.update({
            where: { id: userId },
            data: {
                resetPasswordToken: token,
                resetPasswordExpires: expires
            }
        });
    }

    async updateUserPasswordAndClearToken(userId: string, hashedPw: string): Promise<User> {
        return await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPw,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });
    }

    async getSeekerProfile(userId: string): Promise<SeekerProfile | null> {
        return await prisma.seekerProfile.findUnique({ where: { userId } });
    }

    async getCompanyProfile(userId: string): Promise<CompanyProfile | null> {
        return await prisma.companyProfile.findUnique({ where: { userId } });
    }

    async updateSeekerProfile(userId: string, data: Partial<SeekerProfile>): Promise<SeekerProfile> {
        return await prisma.seekerProfile.update({
            where: { userId },
            data
        });
    }

    async updateCompanyProfile(userId: string, data: Partial<CompanyProfile>): Promise<CompanyProfile> {
        return await prisma.companyProfile.update({
            where: { userId },
            data
        });
    }

    async getAllUsers(options?: { role?: Role; skip?: number; take?: number }): Promise<User[]> {
        return await prisma.user.findMany({
            where: {
                role: options?.role
            },
            skip: options?.skip,
            take: options?.take,
            include: {
                seekerProfile: true,
                companyProfile: true
            }
        });
    }

    async updateUserStatus(userId: string, isBlocked: boolean): Promise<User> {
        return await prisma.user.update({
            where: { id: userId },
            data: { isBlocked }
        });
    }

    async getAllCompanies(options?: { skip?: number; take?: number }): Promise<CompanyProfile[]> {
        return await prisma.companyProfile.findMany({
            skip: options?.skip,
            take: options?.take
        });
    }

    async getPendingCompanies(options?: { skip?: number; take?: number }): Promise<CompanyProfile[]> {
        return await prisma.companyProfile.findMany({
            where: { isApproved: false },
            skip: options?.skip,
            take: options?.take,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        isBlocked: true,
                        createdAt: true
                    }
                }
            }
        });
    }
}
