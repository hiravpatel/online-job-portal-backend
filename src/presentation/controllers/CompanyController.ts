import { Response, NextFunction } from 'express';
import { CompanyService } from '../../application/services/CompanyService';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { ApplicationStatus } from '@prisma/client';
import { ApiResponse } from '../utils/ApiResponse';

export class CompanyController {
    constructor(private companyService: CompanyService) { }

    getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const profile = await this.companyService.getProfile(userId);
            res.status(200).json(ApiResponse.success(profile, 'Profile retrieved successfully'));
        } catch (error) {
            next(error);
        }
    };

    getAllCompanies = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { page, limit } = req.query;
            const companies = await this.companyService.getAllCompanies(
                page ? parseInt(page as string) : 1,
                limit ? parseInt(limit as string) : 10
            );
            res.status(200).json(ApiResponse.success(companies, 'Companies retrieved successfully'));
        } catch (error) {
            next(error);
        }
    };

    getPublicProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.userId as string;
            const profile = await this.companyService.getProfile(userId);
            res.status(200).json(ApiResponse.success(profile, 'Public profile retrieved successfully'));
        } catch (error) {
            next(error);
        }
    };

    updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const { companyName, description, website, location, industry, size } = req.body;
            const updateData = {
                ...(companyName && { companyName }),
                ...(description && { description }),
                ...(website && { website }),
                ...(location && { location }),
                ...(industry && { industry }),
                ...(size && { size })
            };
            const updated = await this.companyService.updateProfile(userId, updateData);
            res.status(200).json(ApiResponse.success(updated, 'Profile updated successfully'));
        } catch (error) {
            next(error);
        }
    };

    uploadLogo = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const file = req.file;
            const url = await this.companyService.uploadLogo(userId, file);
            res.status(200).json(ApiResponse.success({ url }, 'Logo uploaded successfully'));
        } catch (error) {
            next(error);
        }
    };

    postJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            // First get valid companyId -> wait, req.user.id is userId.
            // We need to fetch company profile to get companyId using user.id.
            const profile = await this.companyService.getProfile(req.user!.id);
            const job = await this.companyService.postJob(profile.id, req.body);
            res.status(201).json(ApiResponse.created(job, 'Job posted successfully'));
        } catch (error) {
            next(error);
        }
    };

    updateJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const profile = await this.companyService.getProfile(req.user!.id);
            const jobId = req.params.jobId as string;
            const job = await this.companyService.updateJob(profile.id, jobId, req.body as any);
            res.status(200).json(ApiResponse.success(job, 'Job updated successfully'));
        } catch (error) {
            next(error);
        }
    };

    getCompanyJobs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const profile = await this.companyService.getProfile(req.user!.id);
            const jobs = await this.companyService.getCompanyJobs(profile.id);
            res.status(200).json(ApiResponse.success(jobs, 'Jobs retrieved successfully'));
        } catch (error) {
            next(error);
        }
    };

    getJobApplications = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const profile = await this.companyService.getProfile(req.user!.id);
            const jobId = req.params.jobId as string;
            const apps = await this.companyService.getJobApplications(profile.id, jobId);
            res.status(200).json(ApiResponse.success(apps, 'Applications retrieved successfully'));
        } catch (error) {
            next(error);
        }
    };

    updateApplicationStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const profile = await this.companyService.getProfile(req.user!.id);
            const appId = req.params.appId as string;
            const { status } = req.body;
            const updated = await this.companyService.updateApplicationStatus(profile.id, appId, status as ApplicationStatus);
            res.status(200).json(ApiResponse.success(updated, 'Application status updated successfully'));
        } catch (error) {
            next(error);
        }
    };
}
