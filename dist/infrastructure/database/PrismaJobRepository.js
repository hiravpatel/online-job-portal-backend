"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaJobRepository = void 0;
const prisma_1 = require("./prisma");
class PrismaJobRepository {
    async createJob(companyId, data) {
        return await prisma_1.prisma.job.create({
            data: {
                ...data,
                companyId
            }
        });
    }
    async updateJob(id, companyId, data) {
        return await prisma_1.prisma.job.update({
            where: { id },
            data
        });
    }
    async deleteJob(id, companyId) {
        const result = await prisma_1.prisma.job.deleteMany({
            where: { id, companyId }
        });
        return result.count > 0;
    }
    async getJobById(id) {
        return await prisma_1.prisma.job.findUnique({
            where: { id },
            include: {
                company: {
                    include: {
                        user: {
                            select: {
                                email: true
                            }
                        }
                    }
                }
            }
        });
    }
    async findJobs(filters, skip = 0, take = 10) {
        const where = {};
        if (filters.title)
            where.title = { contains: filters.title, mode: 'insensitive' };
        if (filters.location)
            where.location = { contains: filters.location, mode: 'insensitive' };
        if (filters.companyId)
            where.companyId = filters.companyId;
        if (filters.jobType)
            where.jobType = filters.jobType;
        if (filters.workplaceType)
            where.workplaceType = filters.workplaceType;
        if (filters.isApproved !== undefined)
            where.isApproved = filters.isApproved;
        // Add active filter true by default for seekers
        if (filters.isActive !== undefined)
            where.isActive = filters.isActive;
        if (filters.skills && filters.skills.length > 0) {
            where.skillsRequired = { hasSome: filters.skills };
        }
        return await prisma_1.prisma.job.findMany({
            where,
            skip,
            take,
            include: {
                company: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getJobsByCompany(companyId) {
        return await prisma_1.prisma.job.findMany({
            where: { companyId },
            orderBy: { createdAt: 'desc' }
        });
    }
    async approveJob(id, isApproved) {
        return await prisma_1.prisma.job.update({
            where: { id },
            data: { isApproved }
        });
    }
    async toggleJobActiveStatus(id, companyId, isActive) {
        // We filter by ID, but ideally we should verify companyId at use-case or here.
        const job = await prisma_1.prisma.job.findUnique({ where: { id } });
        if (job?.companyId !== companyId)
            throw new Error("Unauthorized to update this job");
        return await prisma_1.prisma.job.update({
            where: { id },
            data: { isActive }
        });
    }
}
exports.PrismaJobRepository = PrismaJobRepository;
