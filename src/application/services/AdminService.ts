import { UserRepository } from '../../domain/repositories/UserRepository';
import { JobRepository } from '../../domain/repositories/JobRepository';
import { Role } from '@prisma/client';
import { EmailService } from '../../infrastructure/services/EmailService';
import { AppError } from '../../domain/errors/AppError';

export class AdminService {
    constructor(
        private userRepository: UserRepository,
        private jobRepository: JobRepository,
        private emailService: EmailService
    ) { }

    async getAllUsers(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        return await this.userRepository.getAllUsers({ skip, take: limit });
    }

    async getUsersByRole(role: Role, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        return await this.userRepository.getAllUsers({ role, skip, take: limit });
    }

    async toggleUserBlockStatus(userId: string, isBlocked: boolean) {
        return await this.userRepository.updateUserStatus(userId, isBlocked);
    }

    async approveJob(jobId: string) {
        return await this.jobRepository.approveJob(jobId, true);
    }

    async rejectJob(jobId: string) {
        return await this.jobRepository.approveJob(jobId, false);
    }

    async getPendingJobs(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        return await this.jobRepository.findJobs({ isApproved: false }, skip, limit);
    }

    async getPendingCompanies(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        return await this.userRepository.getPendingCompanies({ skip, take: limit });
    }

    async getAllCompanies(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        return await this.userRepository.getAllCompanies({ skip, take: limit });
    }

    async approveCompany(userId: string) {
        // Here userId belongs to the COMPANY User
        // Because of relation, wait, does companyProfile exist on User?
        const profile = await this.userRepository.getCompanyProfile(userId);
        if (!profile) throw new AppError('Company profile not found', 404);
        if (profile.isApproved) throw new AppError('Company is already approved', 400);

        // Update profile
        const updatedProfile = await this.userRepository.updateCompanyProfile(userId, { isApproved: true });

        // Get user for email
        const user = await this.userRepository.findById(userId);
        if (user) {
            const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`;
            await this.emailService.sendCompanyApprovalEmail(user.email, profile.companyName, loginUrl);
        }

        return updatedProfile;
    }
}
