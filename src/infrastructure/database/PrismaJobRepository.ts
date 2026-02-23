import { JobRepository, JobFilter } from '../../domain/repositories/JobRepository';
import { Job } from '@prisma/client';
import { prisma } from './prisma';

export class PrismaJobRepository implements JobRepository {
    async createJob(companyId: string, data: Omit<Job, 'id' | 'companyId' | 'createdAt' | 'updatedAt' | 'isActive' | 'isApproved'>): Promise<Job> {
        return await prisma.job.create({
            data: {
                ...data,
                companyId
            }
        });
    }

    async updateJob(id: string, companyId: string, data: Partial<Job>): Promise<Job> {
        return await prisma.job.update({
            where: { id },
            data
        });
    }

    async deleteJob(id: string, companyId: string): Promise<boolean> {
        const result = await prisma.job.deleteMany({
            where: { id, companyId }
        });
        return result.count > 0;
    }

    async getJobById(id: string): Promise<Job | null> {
        return await prisma.job.findUnique({
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

    async findJobs(filters: JobFilter, skip: number = 0, take: number = 10): Promise<Job[]> {
        const where: any = {};

        if (filters.title) where.title = { contains: filters.title, mode: 'insensitive' };
        if (filters.location) where.location = { contains: filters.location, mode: 'insensitive' };
        if (filters.companyId) where.companyId = filters.companyId;
        if (filters.jobType) where.jobType = filters.jobType;
        if (filters.workplaceType) where.workplaceType = filters.workplaceType;
        if (filters.isApproved !== undefined) where.isApproved = filters.isApproved;
        // Add active filter true by default for seekers
        if (filters.isActive !== undefined) where.isActive = filters.isActive;

        if (filters.skills && filters.skills.length > 0) {
            where.skillsRequired = { hasSome: filters.skills as string[] };
        }

        return await prisma.job.findMany({
            where,
            skip,
            take,
            include: {
                company: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getJobsByCompany(companyId: string): Promise<Job[]> {
        return await prisma.job.findMany({
            where: { companyId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async approveJob(id: string, isApproved: boolean): Promise<Job> {
        return await prisma.job.update({
            where: { id },
            data: { isApproved }
        });
    }

    async toggleJobActiveStatus(id: string, companyId: string, isActive: boolean): Promise<Job> {
        // We filter by ID, but ideally we should verify companyId at use-case or here.
        const job = await prisma.job.findUnique({ where: { id } });
        if (job?.companyId !== companyId) throw new Error("Unauthorized to update this job");

        return await prisma.job.update({
            where: { id },
            data: { isActive }
        });
    }
}
