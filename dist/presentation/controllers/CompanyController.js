"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
class CompanyController {
    companyUseCases;
    constructor(companyUseCases) {
        this.companyUseCases = companyUseCases;
    }
    getProfile = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const profile = await this.companyUseCases.getProfile(userId);
            res.status(200).json({ success: true, data: profile });
        }
        catch (error) {
            next(error);
        }
    };
    updateProfile = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const updated = await this.companyUseCases.updateProfile(userId, req.body);
            res.status(200).json({ success: true, data: updated });
        }
        catch (error) {
            next(error);
        }
    };
    uploadLogo = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const file = req.file;
            const url = await this.companyUseCases.uploadLogo(userId, file);
            res.status(200).json({ success: true, message: 'Logo uploaded', url });
        }
        catch (error) {
            next(error);
        }
    };
    postJob = async (req, res, next) => {
        try {
            // First get valid companyId -> wait, req.user.id is userId.
            // We need to fetch company profile to get companyId using user.id.
            const profile = await this.companyUseCases.getProfile(req.user.id);
            const job = await this.companyUseCases.postJob(profile.id, req.body);
            res.status(201).json({ success: true, data: job });
        }
        catch (error) {
            next(error);
        }
    };
    updateJob = async (req, res, next) => {
        try {
            const profile = await this.companyUseCases.getProfile(req.user.id);
            const jobId = req.params.jobId;
            const job = await this.companyUseCases.updateJob(profile.id, jobId, req.body);
            res.status(200).json({ success: true, data: job });
        }
        catch (error) {
            next(error);
        }
    };
    getCompanyJobs = async (req, res, next) => {
        try {
            const profile = await this.companyUseCases.getProfile(req.user.id);
            const jobs = await this.companyUseCases.getCompanyJobs(profile.id);
            res.status(200).json({ success: true, data: jobs });
        }
        catch (error) {
            next(error);
        }
    };
    getJobApplications = async (req, res, next) => {
        try {
            const profile = await this.companyUseCases.getProfile(req.user.id);
            const jobId = req.params.jobId;
            const apps = await this.companyUseCases.getJobApplications(profile.id, jobId);
            res.status(200).json({ success: true, data: apps });
        }
        catch (error) {
            next(error);
        }
    };
    updateApplicationStatus = async (req, res, next) => {
        try {
            const profile = await this.companyUseCases.getProfile(req.user.id);
            const appId = req.params.appId;
            const { status } = req.body;
            const updated = await this.companyUseCases.updateApplicationStatus(profile.id, appId, status);
            res.status(200).json({ success: true, data: updated });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.CompanyController = CompanyController;
