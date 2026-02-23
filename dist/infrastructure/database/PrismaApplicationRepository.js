"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaApplicationRepository = void 0;
const prisma_1 = require("./prisma");
class PrismaApplicationRepository {
    async applyForJob(jobId, seekerId, resumeUrl, coverLetter) {
        return await prisma_1.prisma.application.create({
            data: {
                jobId,
                seekerId,
                resumeUrl,
                coverLetter
            }
        });
    }
    async getApplicationById(id) {
        return await prisma_1.prisma.application.findUnique({
            where: { id },
            include: {
                job: true,
                seeker: {
                    include: {
                        seekerProfile: true
                    }
                }
            }
        });
    }
    async hasSeekerApplied(jobId, seekerId) {
        const existing = await prisma_1.prisma.application.findUnique({
            where: {
                jobId_seekerId: {
                    jobId,
                    seekerId
                }
            }
        });
        return !!existing;
    }
    async getApplicationsBySeeker(seekerId) {
        return await prisma_1.prisma.application.findMany({
            where: { seekerId },
            include: {
                job: {
                    include: {
                        company: true
                    }
                }
            },
            orderBy: { appliedAt: 'desc' }
        });
    }
    async getApplicationsForJob(jobId, companyId) {
        // First verify job belongs to company
        const job = await prisma_1.prisma.job.findUnique({ where: { id: jobId } });
        if (job?.companyId !== companyId) {
            throw new Error("Unauthorized to view applications for this job");
        }
        return await prisma_1.prisma.application.findMany({
            where: { jobId },
            include: {
                seeker: {
                    include: {
                        seekerProfile: true
                    }
                }
            },
            orderBy: { appliedAt: 'desc' }
        });
    }
    async updateApplicationStatus(id, companyId, status) {
        const application = await prisma_1.prisma.application.findUnique({
            where: { id },
            include: { job: true }
        });
        if (!application || application.job.companyId !== companyId) {
            throw new Error("Application not found or unauthorized");
        }
        return await prisma_1.prisma.application.update({
            where: { id },
            data: { status }
        });
    }
}
exports.PrismaApplicationRepository = PrismaApplicationRepository;
