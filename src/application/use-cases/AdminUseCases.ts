import { UserRepository } from '../../domain/repositories/UserRepository';
import { JobRepository } from '../../domain/repositories/JobRepository';
import { Role } from '@prisma/client';

export class AdminUseCases {
    constructor(
        private userRepository: UserRepository,
        private jobRepository: JobRepository
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
}
