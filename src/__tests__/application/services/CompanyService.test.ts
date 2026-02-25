import { CompanyService } from '../../../application/services/CompanyService';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { JobRepository } from '../../../domain/repositories/JobRepository';
import { ApplicationRepository } from '../../../domain/repositories/ApplicationRepository';
import { IUploadService } from '../../../application/interfaces/IUploadService';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { NotFoundError } from '../../../domain/errors/CustomErrors';
import { ApplicationStatus } from '@prisma/client';

describe('CompanyService', () => {
    let userRepositoryMock: DeepMockProxy<UserRepository>;
    let jobRepositoryMock: DeepMockProxy<JobRepository>;
    let applicationRepositoryMock: DeepMockProxy<ApplicationRepository>;
    let uploadServiceMock: DeepMockProxy<IUploadService>;
    let companyService: CompanyService;

    beforeEach(() => {
        userRepositoryMock = mockDeep<UserRepository>();
        jobRepositoryMock = mockDeep<JobRepository>();
        applicationRepositoryMock = mockDeep<ApplicationRepository>();
        uploadServiceMock = mockDeep<IUploadService>();

        companyService = new CompanyService(
            userRepositoryMock as any,
            jobRepositoryMock as any,
            applicationRepositoryMock as any,
            uploadServiceMock as any
        );
    });

    describe('getProfile', () => {
        it('should return company profile', async () => {
            const mockProfile = { companyName: 'Acme Corp' } as any;
            userRepositoryMock.getCompanyProfile.mockResolvedValueOnce(mockProfile);

            const result = await companyService.getProfile('1');

            expect(result).toEqual(mockProfile);
            expect(userRepositoryMock.getCompanyProfile).toHaveBeenCalledWith('1');
        });

        it('should throw NotFoundError if profile does not exist', async () => {
            userRepositoryMock.getCompanyProfile.mockResolvedValueOnce(null);

            await expect(companyService.getProfile('1')).rejects.toThrow(NotFoundError);
        });
    });

    describe('postJob', () => {
        it('should create a job using repository', async () => {
            const jobData = { title: 'Engineer' } as any;
            jobRepositoryMock.createJob.mockResolvedValueOnce({ ...jobData, id: 'job-1' });

            const result = await companyService.postJob('company-1', jobData);

            expect(result.id).toEqual('job-1');
            expect(jobRepositoryMock.createJob).toHaveBeenCalledWith('company-1', jobData);
        });
    });

    describe('updateApplicationStatus', () => {
        it('should update application status', async () => {
            applicationRepositoryMock.updateApplicationStatus.mockResolvedValueOnce({ id: 'app-1', status: ApplicationStatus.SHORTLISTED } as any);

            const result = await companyService.updateApplicationStatus('company-1', 'app-1', ApplicationStatus.SHORTLISTED);

            expect(result.status).toEqual(ApplicationStatus.SHORTLISTED);
            expect(applicationRepositoryMock.updateApplicationStatus).toHaveBeenCalledWith('app-1', 'company-1', ApplicationStatus.SHORTLISTED);
        });
    });
});
