"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeekerUseCases = void 0;
class SeekerUseCases {
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
        const profile = await this.userRepository.getSeekerProfile(userId);
        if (!profile)
            throw new Error('Profile not found');
        return profile;
    }
    async updateProfile(userId, data) {
        return await this.userRepository.updateSeekerProfile(userId, data);
    }
    async uploadPhoto(userId, file) {
        const url = await this.uploadService.uploadFile(file, 'photos');
        await this.userRepository.updateSeekerProfile(userId, { photoUrl: url });
        return url;
    }
    async searchJobs(filters, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        filters.isActive = true;
        filters.isApproved = true; // Only show approved jobs
        return await this.jobRepository.findJobs(filters, skip, limit);
    }
    async applyForJob(seekerId, jobId, coverLetter, resumeFile) {
        const job = await this.jobRepository.getJobById(jobId);
        if (!job || !job.isActive || !job.isApproved)
            throw new Error('Job is not available for applying');
        const hasApplied = await this.applicationRepository.hasSeekerApplied(jobId, seekerId);
        if (hasApplied)
            throw new Error('You have already applied for this job');
        let resumeUrl = undefined;
        if (resumeFile) {
            resumeUrl = await this.uploadService.uploadFile(resumeFile, 'resumes');
        }
        return await this.applicationRepository.applyForJob(jobId, seekerId, resumeUrl, coverLetter);
    }
    async getMyApplications(seekerId) {
        return await this.applicationRepository.getApplicationsBySeeker(seekerId);
    }
}
exports.SeekerUseCases = SeekerUseCases;
