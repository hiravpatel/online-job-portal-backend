"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUseCases = void 0;
class AdminUseCases {
    userRepository;
    jobRepository;
    constructor(userRepository, jobRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
    }
    async getAllUsers(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return await this.userRepository.getAllUsers({ skip, take: limit });
    }
    async getUsersByRole(role, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return await this.userRepository.getAllUsers({ role, skip, take: limit });
    }
    async toggleUserBlockStatus(userId, isBlocked) {
        return await this.userRepository.updateUserStatus(userId, isBlocked);
    }
    async approveJob(jobId) {
        return await this.jobRepository.approveJob(jobId, true);
    }
    async rejectJob(jobId) {
        return await this.jobRepository.approveJob(jobId, false);
    }
    async getPendingJobs(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return await this.jobRepository.findJobs({ isApproved: false }, skip, limit);
    }
}
exports.AdminUseCases = AdminUseCases;
