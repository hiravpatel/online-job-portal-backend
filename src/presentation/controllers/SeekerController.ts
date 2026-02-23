import { Response, NextFunction } from 'express';
import { SeekerUseCases } from '../../application/use-cases/SeekerUseCases';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { ApiResponse } from '../utils/ApiResponse';

export class SeekerController {
    constructor(private seekerUseCases: SeekerUseCases) { }

    getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const profile = await this.seekerUseCases.getProfile(userId);
            res.status(200).json(ApiResponse.success(profile, 'Profile retrieved successfully'));
        } catch (error) {
            next(error);
        }
    };

    getPublicProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.userId as string;
            const profile = await this.seekerUseCases.getProfile(userId);
            res.status(200).json(ApiResponse.success(profile, 'Public profile retrieved successfully'));
        } catch (error) {
            next(error);
        }
    };

    updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const { firstName, lastName, skills, experience, education } = req.body;
            const updateData = {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(skills && { skills }),
                ...(experience !== undefined && { experience }),
                ...(education && { education })
            };
            const updated = await this.seekerUseCases.updateProfile(userId, updateData);
            res.status(200).json(ApiResponse.success(updated, 'Profile updated successfully'));
        } catch (error) {
            next(error);
        }
    };

    uploadPhoto = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const file = req.file;
            const url = await this.seekerUseCases.uploadPhoto(userId, file);
            res.status(200).json(ApiResponse.success({ url }, 'Photo uploaded successfully'));
        } catch (error) {
            next(error);
        }
    };

    searchJobs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { page, limit, ...filters } = req.query;
            const jobs = await this.seekerUseCases.searchJobs(
                filters,
                page ? parseInt(page as string) : 1,
                limit ? parseInt(limit as string) : 10
            );
            res.status(200).json(ApiResponse.success(jobs, 'Jobs retrieved successfully'));
        } catch (error) {
            next(error);
        }
    };

    applyForJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const seekerId = req.user!.id;
            const jobId = req.params.jobId as string;
            const { coverLetter } = req.body;
            const resumeFile = req.file;

            const application = await this.seekerUseCases.applyForJob(seekerId, jobId, coverLetter as string, resumeFile as any);
            res.status(201).json(ApiResponse.created(application, 'Applied for job successfully'));
        } catch (error: any) {
            if (error.message.includes('already applied') || error.message.includes('not available')) {
                error.statusCode = 400;
            }
            next(error);
        }
    };

    getMyApplications = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const seekerId = req.user!.id;
            const apps = await this.seekerUseCases.getMyApplications(seekerId);
            res.status(200).json(ApiResponse.success(apps, 'Applications retrieved successfully'));
        } catch (error) {
            next(error);
        }
    };
}
