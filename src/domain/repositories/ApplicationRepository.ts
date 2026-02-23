import { Application, ApplicationStatus } from '@prisma/client';

export interface ApplicationRepository {
    applyForJob(jobId: string, seekerId: string, resumeUrl?: string, coverLetter?: string): Promise<Application>;
    getApplicationById(id: string): Promise<Application | null>;

    hasSeekerApplied(jobId: string, seekerId: string): Promise<boolean>;

    getApplicationsBySeeker(seekerId: string): Promise<(Application & { job: any })[]>;
    getApplicationsForJob(jobId: string, companyId: string): Promise<(Application & { seeker: any })[]>;

    updateApplicationStatus(id: string, companyId: string, status: ApplicationStatus): Promise<Application>;
}
