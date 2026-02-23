"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const prisma_1 = require("./prisma");
class PrismaUserRepository {
    async createSeeker(userData, profileData) {
        return await prisma_1.prisma.user.create({
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
    async createCompany(userData, profileData) {
        return await prisma_1.prisma.user.create({
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
    async createAdmin(userData) {
        return await prisma_1.prisma.user.create({
            data: userData
        });
    }
    async findByEmail(email) {
        return await prisma_1.prisma.user.findUnique({ where: { email } });
    }
    async findById(id) {
        return await prisma_1.prisma.user.findUnique({ where: { id } });
    }
    async getSeekerProfile(userId) {
        return await prisma_1.prisma.seekerProfile.findUnique({ where: { userId } });
    }
    async getCompanyProfile(userId) {
        return await prisma_1.prisma.companyProfile.findUnique({ where: { userId } });
    }
    async updateSeekerProfile(userId, data) {
        return await prisma_1.prisma.seekerProfile.update({
            where: { userId },
            data
        });
    }
    async updateCompanyProfile(userId, data) {
        return await prisma_1.prisma.companyProfile.update({
            where: { userId },
            data
        });
    }
    async getAllUsers(options) {
        return await prisma_1.prisma.user.findMany({
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
    async updateUserStatus(userId, isBlocked) {
        return await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { isBlocked }
        });
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
