import { Job, JobType, WorkplaceType } from '@prisma/client';

export interface JobFilter {
    title?: string;
    location?: string;
    skills?: string[];
    companyId?: string;
    jobType?: JobType;
    workplaceType?: WorkplaceType;
    experienceLevel?: string;
    isApproved?: boolean;
    isActive?: boolean;
}

export interface JobRepository {
    createJob(companyId: string, data: Omit<Job, 'id' | 'companyId' | 'createdAt' | 'updatedAt' | 'isActive' | 'isApproved'>): Promise<Job>;
    updateJob(id: string, companyId: string, data: Partial<Job>): Promise<Job>;
    deleteJob(id: string, companyId: string): Promise<boolean>;

    getJobById(id: string): Promise<Job | null>;
    findJobs(filters: JobFilter, skip?: number, take?: number): Promise<Job[]>;
    getJobsByCompany(companyId: string): Promise<Job[]>;

    approveJob(id: string, isApproved: boolean): Promise<Job>;
    toggleJobActiveStatus(id: string, companyId: string, isActive: boolean): Promise<Job>;
}
