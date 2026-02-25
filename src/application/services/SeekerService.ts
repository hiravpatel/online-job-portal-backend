import { UserRepository } from '../../domain/repositories/UserRepository';
import { JobRepository } from '../../domain/repositories/JobRepository';
import { ApplicationRepository } from '../../domain/repositories/ApplicationRepository';
import { IUploadService } from '../interfaces/IUploadService';
import { NotFoundError, BadRequestError } from '../../domain/errors/CustomErrors';

export class SeekerService {
    constructor(
        private userRepository: UserRepository,
        private jobRepository: JobRepository,
        private applicationRepository: ApplicationRepository,
        private uploadService: IUploadService
    ) { }

    async getProfile(userId: string) {
        const profile = await this.userRepository.getSeekerProfile(userId);
        if (!profile) throw new NotFoundError('Profile not found');
        return profile;
    }

    async updateProfile(userId: string, data: any) {
        return await this.userRepository.updateSeekerProfile(userId, data);
    }

    async uploadPhoto(userId: string, file: any) {
        const url = await this.uploadService.uploadFile(file, 'photos');
        await this.userRepository.updateSeekerProfile(userId, { photoUrl: url });
        return url;
    }

    async searchJobs(filters: any, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        filters.isActive = true;
        filters.isApproved = true; // Only show approved jobs
        return await this.jobRepository.findJobs(filters, skip, limit);
    }

    async applyForJob(seekerId: string, jobId: string, coverLetter?: string, resumeFile?: any) {
        const job = await this.jobRepository.getJobById(jobId);
        if (!job || !job.isActive || !job.isApproved) throw new BadRequestError('Job is not available for applying');

        const hasApplied = await this.applicationRepository.hasSeekerApplied(jobId, seekerId);
        if (hasApplied) throw new BadRequestError('You have already applied for this job');

        let resumeUrl = undefined;
        if (resumeFile) {
            resumeUrl = await this.uploadService.uploadFile(resumeFile, 'resumes');
        }

        return await this.applicationRepository.applyForJob(jobId, seekerId, resumeUrl, coverLetter);
    }

    async getMyApplications(seekerId: string) {
        return await this.applicationRepository.getApplicationsBySeeker(seekerId);
    }
}
