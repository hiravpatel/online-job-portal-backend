import { Response, NextFunction } from 'express';
import { AdminService } from '../../application/services/AdminService';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { Role } from '@prisma/client';
import { ApiResponse } from '../utils/ApiResponse';

export class AdminController {
    constructor(private adminService: AdminService) { }

    getAllUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { role, page, limit } = req.query;
            let users;
            if (role) {
                users = await this.adminService.getUsersByRole(
                    role as Role,
                    page ? parseInt(page as string) : 1,
                    limit ? parseInt(limit as string) : 10
                );
            } else {
                users = await this.adminService.getAllUsers(
                    page ? parseInt(page as string) : 1,
                    limit ? parseInt(limit as string) : 10
                );
            }
            res.status(200).json(ApiResponse.success(users, 'Users retrieved successfully'));
        } catch (error) {
            next(error);
        }
    };

    toggleUserBlockStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.userId as string;
            const { isBlocked } = req.body;
            const updated = await this.adminService.toggleUserBlockStatus(userId, Boolean(isBlocked));
            res.status(200).json(ApiResponse.success(updated, 'User block status toggled'));
        } catch (error) {
            next(error);
        }
    };

    getPendingJobs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { page, limit } = req.query;
            const jobs = await this.adminService.getPendingJobs(
                page ? parseInt(page as string) : 1,
                limit ? parseInt(limit as string) : 10
            );
            res.status(200).json(ApiResponse.success(jobs, 'Pending jobs retrieved successfully'));
        } catch (error) {
            next(error);
        }
    };

    getPendingCompanies = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { page, limit } = req.query;
            const companies = await this.adminService.getPendingCompanies(
                page ? parseInt(page as string) : 1,
                limit ? parseInt(limit as string) : 10
            );
            res.status(200).json(ApiResponse.success(companies, 'Pending companies retrieved successfully'));
        } catch (error) {
            next(error);
        }
    };

    getAllCompanies = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { page, limit } = req.query;
            const companies = await this.adminService.getAllCompanies(
                page ? parseInt(page as string) : 1,
                limit ? parseInt(limit as string) : 10
            );
            res.status(200).json(ApiResponse.success(companies, 'All companies retrieved successfully'));
        } catch (error) {
            next(error);
        }
    };

    approveJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const jobId = req.params.jobId as string;
            const job = await this.adminService.approveJob(jobId);
            res.status(200).json(ApiResponse.success(job, 'Job approved successfully'));
        } catch (error) {
            next(error);
        }
    };

    rejectJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const jobId = req.params.jobId as string;
            const job = await this.adminService.rejectJob(jobId);
            res.status(200).json(ApiResponse.success(job, 'Job rejected'));
        } catch (error) {
            next(error);
        }
    };

    approveCompany = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const companyUserId = req.params.userId as string;
            const companyProfile = await this.adminService.approveCompany(companyUserId);
            res.status(200).json(ApiResponse.success(companyProfile, 'Company approved successfully'));
        } catch (error) {
            next(error);
        }
    };
}
