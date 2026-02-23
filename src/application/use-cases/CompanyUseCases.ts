import { UserRepository } from '../../domain/repositories/UserRepository';
import { JobRepository } from '../../domain/repositories/JobRepository';
import { ApplicationRepository } from '../../domain/repositories/ApplicationRepository';
import { IUploadService } from '../interfaces/IUploadService';
import { ApplicationStatus } from '@prisma/client';

export class CompanyUseCases {
    constructor(
        private userRepository: UserRepository,
        private jobRepository: JobRepository,
        private applicationRepository: ApplicationRepository,
        private uploadService: IUploadService
    ) { }

    async getProfile(userId: string) {
        const profile = await this.userRepository.getCompanyProfile(userId);
        if (!profile) throw new Error('Company profile not found');
        return profile;
    }

    async getAllCompanies(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        return await this.userRepository.getAllCompanies({ skip, take: limit });
    }

    async updateProfile(userId: string, data: any) {
        return await this.userRepository.updateCompanyProfile(userId, data);
    }

    async uploadLogo(userId: string, file: any) {
        const url = await this.uploadService.uploadFile(file, 'logos');
        await this.userRepository.updateCompanyProfile(userId, { logoUrl: url });
        return url;
    }

    async postJob(companyId: string, data: any) {
        return await this.jobRepository.createJob(companyId, data);
    }

    async updateJob(companyId: string, jobId: string, data: any) {
        return await this.jobRepository.updateJob(jobId, companyId, data);
    }

    async getCompanyJobs(companyId: string) {
        return await this.jobRepository.getJobsByCompany(companyId);
    }

    async getJobApplications(companyId: string, jobId: string) {
        return await this.applicationRepository.getApplicationsForJob(jobId, companyId);
    }

    async updateApplicationStatus(companyId: string, applicationId: string, status: ApplicationStatus) {
        return await this.applicationRepository.updateApplicationStatus(applicationId, companyId, status);
    }
}
