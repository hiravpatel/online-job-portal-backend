import { SeekerService } from '../../../application/services/SeekerService';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { JobRepository } from '../../../domain/repositories/JobRepository';
import { ApplicationRepository } from '../../../domain/repositories/ApplicationRepository';
import { IUploadService } from '../../../application/interfaces/IUploadService';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { BadRequestError, NotFoundError } from '../../../domain/errors/CustomErrors';

describe('SeekerService', () => {
    let userRepositoryMock: DeepMockProxy<UserRepository>;
    let jobRepositoryMock: DeepMockProxy<JobRepository>;
    let applicationRepositoryMock: DeepMockProxy<ApplicationRepository>;
    let uploadServiceMock: DeepMockProxy<IUploadService>;
    let seekerService: SeekerService;

    beforeEach(() => {
        userRepositoryMock = mockDeep<UserRepository>();
        jobRepositoryMock = mockDeep<JobRepository>();
        applicationRepositoryMock = mockDeep<ApplicationRepository>();
        uploadServiceMock = mockDeep<IUploadService>();

        seekerService = new SeekerService(
            userRepositoryMock as any,
            jobRepositoryMock as any,
            applicationRepositoryMock as any,
            uploadServiceMock as any
        );
    });

    describe('getProfile', () => {
        it('should return seeker profile', async () => {
            const mockProfile = { firstName: 'John' } as any;
            userRepositoryMock.getSeekerProfile.mockResolvedValueOnce(mockProfile);

            const result = await seekerService.getProfile('1');

            expect(result).toEqual(mockProfile);
        });

        it('should throw NotFoundError if profile not found', async () => {
            userRepositoryMock.getSeekerProfile.mockResolvedValueOnce(null);

            await expect(seekerService.getProfile('1')).rejects.toThrow(NotFoundError);
        });
    });

    describe('searchJobs', () => {
        it('should only search active and approved jobs', async () => {
            jobRepositoryMock.findJobs.mockResolvedValueOnce({ data: [], total: 0 } as any);

            await seekerService.searchJobs({ keyword: 'test' }, 1, 10);

            expect(jobRepositoryMock.findJobs).toHaveBeenCalledWith(
                { keyword: 'test', isActive: true, isApproved: true },
                0,
                10
            );
        });
    });

    describe('applyForJob', () => {
        it('should apply for job successfully', async () => {
            const mockJob = { id: 'job-1', isActive: true, isApproved: true } as any;
            jobRepositoryMock.getJobById.mockResolvedValueOnce(mockJob);
            applicationRepositoryMock.hasSeekerApplied.mockResolvedValueOnce(false);
            applicationRepositoryMock.applyForJob.mockResolvedValueOnce({ id: 'app-1' } as any);

            const result = await seekerService.applyForJob('seeker-1', 'job-1');

            expect(result.id).toEqual('app-1');
            expect(applicationRepositoryMock.applyForJob).toHaveBeenCalledWith('job-1', 'seeker-1', undefined, undefined);
        });

        it('should throw BadRequestError if job is inactive or unapproved', async () => {
            const mockJob = { id: 'job-1', isActive: false, isApproved: true } as any;
            jobRepositoryMock.getJobById.mockResolvedValueOnce(mockJob);

            await expect(seekerService.applyForJob('seeker-1', 'job-1')).rejects.toThrow(BadRequestError);
        });

        it('should throw BadRequestError if user already applied', async () => {
            const mockJob = { id: 'job-1', isActive: true, isApproved: true } as any;
            jobRepositoryMock.getJobById.mockResolvedValueOnce(mockJob);
            applicationRepositoryMock.hasSeekerApplied.mockResolvedValueOnce(true);

            await expect(seekerService.applyForJob('seeker-1', 'job-1')).rejects.toThrow(BadRequestError);
        });
    });
});
