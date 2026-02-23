"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
class AdminController {
    adminUseCases;
    constructor(adminUseCases) {
        this.adminUseCases = adminUseCases;
    }
    getAllUsers = async (req, res, next) => {
        try {
            const { role, page, limit } = req.query;
            let users;
            if (role) {
                users = await this.adminUseCases.getUsersByRole(role, page ? parseInt(page) : 1, limit ? parseInt(limit) : 10);
            }
            else {
                users = await this.adminUseCases.getAllUsers(page ? parseInt(page) : 1, limit ? parseInt(limit) : 10);
            }
            res.status(200).json({ success: true, data: users });
        }
        catch (error) {
            next(error);
        }
    };
    toggleUserBlockStatus = async (req, res, next) => {
        try {
            const userId = req.params.userId;
            const { isBlocked } = req.body;
            const updated = await this.adminUseCases.toggleUserBlockStatus(userId, Boolean(isBlocked));
            res.status(200).json({ success: true, data: updated });
        }
        catch (error) {
            next(error);
        }
    };
    getPendingJobs = async (req, res, next) => {
        try {
            const { page, limit } = req.query;
            const jobs = await this.adminUseCases.getPendingJobs(page ? parseInt(page) : 1, limit ? parseInt(limit) : 10);
            res.status(200).json({ success: true, data: jobs });
        }
        catch (error) {
            next(error);
        }
    };
    approveJob = async (req, res, next) => {
        try {
            const jobId = req.params.jobId;
            const job = await this.adminUseCases.approveJob(jobId);
            res.status(200).json({ success: true, data: job });
        }
        catch (error) {
            next(error);
        }
    };
    rejectJob = async (req, res, next) => {
        try {
            const jobId = req.params.jobId;
            const job = await this.adminUseCases.rejectJob(jobId);
            res.status(200).json({ success: true, message: 'Job rejected', data: job });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AdminController = AdminController;
