"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyUseCases = void 0;
class CompanyUseCases {
    userRepository;
    jobRepository;
    applicationRepository;
    uploadService;
    constructor(userRepository, jobRepository, applicationRepository, uploadService) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.uploadService = uploadService;
    }
    async getProfile(userId) {
        const profile = await this.userRepository.getCompanyProfile(userId);
        if (!profile)
            throw new Error('Company profile not found');
        return profile;
    }
    async updateProfile(userId, data) {
        return await this.userRepository.updateCompanyProfile(userId, data);
    }
    async uploadLogo(userId, file) {
        const url = await this.uploadService.uploadFile(file, 'logos');
        await this.userRepository.updateCompanyProfile(userId, { logoUrl: url });
        return url;
    }
    async postJob(companyId, data) {
        return await this.jobRepository.createJob(companyId, data);
    }
    async updateJob(companyId, jobId, data) {
        return await this.jobRepository.updateJob(jobId, companyId, data);
    }
    async getCompanyJobs(companyId) {
        return await this.jobRepository.getJobsByCompany(companyId);
    }
    async getJobApplications(companyId, jobId) {
        return await this.applicationRepository.getApplicationsForJob(jobId, companyId);
    }
    async updateApplicationStatus(companyId, applicationId, status) {
        return await this.applicationRepository.updateApplicationStatus(applicationId, companyId, status);
    }
}
exports.CompanyUseCases = CompanyUseCases;
