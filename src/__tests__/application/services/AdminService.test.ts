import { AdminService } from '../../../application/services/AdminService';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { JobRepository } from '../../../domain/repositories/JobRepository';
import { EmailService } from '../../../infrastructure/services/EmailService';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { AppError } from '../../../domain/errors/AppError';

describe('AdminService', () => {
    let userRepositoryMock: DeepMockProxy<UserRepository>;
    let jobRepositoryMock: DeepMockProxy<JobRepository>;
    let emailServiceMock: DeepMockProxy<EmailService>;
    let adminService: AdminService;

    beforeEach(() => {
        userRepositoryMock = mockDeep<UserRepository>();
        jobRepositoryMock = mockDeep<JobRepository>();
        emailServiceMock = mockDeep<EmailService>();

        adminService = new AdminService(
            userRepositoryMock as any,
            jobRepositoryMock as any,
            emailServiceMock as any
        );
    });

    describe('approveCompany', () => {
        it('should successfully approve a pending company and send an email', async () => {
            const userId = '1';
            const mockProfile = { isApproved: false, companyName: 'Acme Corp' } as any;
            const mockUser = { id: userId, email: 'company@acme.com' } as any;
            const updatedProfile = { isApproved: true, companyName: 'Acme Corp' } as any;

            userRepositoryMock.getCompanyProfile.mockResolvedValueOnce(mockProfile);
            userRepositoryMock.updateCompanyProfile.mockResolvedValueOnce(updatedProfile);
            userRepositoryMock.findById.mockResolvedValueOnce(mockUser);

            const result = await adminService.approveCompany(userId);

            expect(result.isApproved).toBe(true);
            expect(userRepositoryMock.updateCompanyProfile).toHaveBeenCalledWith(userId, { isApproved: true });
            expect(emailServiceMock.sendCompanyApprovalEmail).toHaveBeenCalledWith(
                mockUser.email,
                mockProfile.companyName,
                expect.any(String)
            );
        });

        it('should throw AppError if company profile is not found', async () => {
            userRepositoryMock.getCompanyProfile.mockResolvedValueOnce(null);

            await expect(adminService.approveCompany('1')).rejects.toThrow(AppError);
        });

        it('should throw AppError if company is already approved', async () => {
            const mockProfile = { isApproved: true } as any;
            userRepositoryMock.getCompanyProfile.mockResolvedValueOnce(mockProfile);

            await expect(adminService.approveCompany('1')).rejects.toThrow(AppError);
        });
    });

    describe('approveJob / rejectJob', () => {
        it('should approve a job', async () => {
            jobRepositoryMock.approveJob.mockResolvedValueOnce({ id: 'job-1', isApproved: true } as any);

            const result = await adminService.approveJob('job-1');

            expect(result).toHaveProperty('isApproved', true);
            expect(jobRepositoryMock.approveJob).toHaveBeenCalledWith('job-1', true);
        });

        it('should reject a job', async () => {
            jobRepositoryMock.approveJob.mockResolvedValueOnce({ id: 'job-1', isApproved: false } as any);

            const result = await adminService.rejectJob('job-1');

            expect(result).toHaveProperty('isApproved', false);
            expect(jobRepositoryMock.approveJob).toHaveBeenCalledWith('job-1', false);
        });
    });

    describe('User Management', () => {
        it('should toggle user block status', async () => {
            userRepositoryMock.updateUserStatus.mockResolvedValueOnce({ id: '1', isBlocked: true } as any);

            const result = await adminService.toggleUserBlockStatus('1', true);

            expect(result).toHaveProperty('isBlocked', true);
            expect(userRepositoryMock.updateUserStatus).toHaveBeenCalledWith('1', true);
        });
    });
});
