import { ApplicationRepository } from '../../domain/repositories/ApplicationRepository';
import { Application, ApplicationStatus } from '@prisma/client';
import { prisma } from './prisma';

export class PrismaApplicationRepository implements ApplicationRepository {
    async applyForJob(jobId: string, seekerId: string, resumeUrl?: string, coverLetter?: string): Promise<Application> {
        return await prisma.application.create({
            data: {
                jobId,
                seekerId,
                resumeUrl,
                coverLetter
            }
        });
    }

    async getApplicationById(id: string): Promise<Application | null> {
        return await prisma.application.findUnique({
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

    async hasSeekerApplied(jobId: string, seekerId: string): Promise<boolean> {
        const existing = await prisma.application.findUnique({
            where: {
                jobId_seekerId: {
                    jobId,
                    seekerId
                }
            }
        });
        return !!existing;
    }

    async getApplicationsBySeeker(seekerId: string): Promise<(Application & { job: any })[]> {
        return await prisma.application.findMany({
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

    async getApplicationsForJob(jobId: string, companyId: string): Promise<(Application & { seeker: any })[]> {
        // First verify job belongs to company
        const job = await prisma.job.findUnique({ where: { id: jobId } });
        if (job?.companyId !== companyId) {
            throw new Error("Unauthorized to view applications for this job");
        }

        return await prisma.application.findMany({
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

    async updateApplicationStatus(id: string, companyId: string, status: ApplicationStatus): Promise<Application> {
        const application = await prisma.application.findUnique({
            where: { id },
            include: { job: true }
        });

        if (!application || application.job.companyId !== companyId) {
            throw new Error("Application not found or unauthorized");
        }

        return await prisma.application.update({
            where: { id },
            data: { status }
        });
    }
}
