"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeekerController = void 0;
class SeekerController {
    seekerUseCases;
    constructor(seekerUseCases) {
        this.seekerUseCases = seekerUseCases;
    }
    getProfile = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const profile = await this.seekerUseCases.getProfile(userId);
            res.status(200).json({ success: true, data: profile });
        }
        catch (error) {
            next(error);
        }
    };
    updateProfile = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const updated = await this.seekerUseCases.updateProfile(userId, req.body);
            res.status(200).json({ success: true, data: updated });
        }
        catch (error) {
            next(error);
        }
    };
    uploadPhoto = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const file = req.file;
            const url = await this.seekerUseCases.uploadPhoto(userId, file);
            res.status(200).json({ success: true, message: 'Photo uploaded', url });
        }
        catch (error) {
            next(error);
        }
    };
    searchJobs = async (req, res, next) => {
        try {
            const { page, limit, ...filters } = req.query;
            const jobs = await this.seekerUseCases.searchJobs(filters, page ? parseInt(page) : 1, limit ? parseInt(limit) : 10);
            res.status(200).json({ success: true, data: jobs });
        }
        catch (error) {
            next(error);
        }
    };
    applyForJob = async (req, res, next) => {
        try {
            const seekerId = req.user.id;
            const jobId = req.params.jobId;
            const { coverLetter } = req.body;
            const resumeFile = req.file;
            const application = await this.seekerUseCases.applyForJob(seekerId, jobId, coverLetter, resumeFile);
            res.status(201).json({ success: true, data: application });
        }
        catch (error) {
            if (error.message.includes('already applied') || error.message.includes('not available')) {
                error.statusCode = 400;
            }
            next(error);
        }
    };
    getMyApplications = async (req, res, next) => {
        try {
            const seekerId = req.user.id;
            const apps = await this.seekerUseCases.getMyApplications(seekerId);
            res.status(200).json({ success: true, data: apps });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.SeekerController = SeekerController;
