import { AuthService } from '../../../application/services/AuthService';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { IAuthService } from '../../../application/interfaces/IAuthService';
import { EmailService } from '../../../infrastructure/services/EmailService';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Role } from '@prisma/client';
import { ConflictError, UnauthorizedError, ForbiddenError } from '../../../domain/errors/CustomErrors';

describe('AuthService', () => {
    let userRepositoryMock: DeepMockProxy<UserRepository>;
    let authServiceMock: DeepMockProxy<IAuthService>;
    let emailServiceMock: DeepMockProxy<EmailService>;
    let authService: AuthService;

    beforeEach(() => {
        userRepositoryMock = mockDeep<UserRepository>();
        authServiceMock = mockDeep<IAuthService>();
        emailServiceMock = mockDeep<EmailService>();

        authService = new AuthService(
            userRepositoryMock as any,
            authServiceMock as any,
            emailServiceMock as any
        );
    });

    describe('registerSeeker', () => {
        it('should successfully register a seeker when valid data is provided', async () => {
            const mockData = {
                email: 'seeker@test.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe'
            };

            userRepositoryMock.findByEmail.mockResolvedValueOnce(null);
            authServiceMock.hashPassword.mockResolvedValueOnce('hashedPassword');
            userRepositoryMock.createSeeker.mockResolvedValueOnce({
                id: '1', role: Role.SEEKER
            } as any);
            authServiceMock.generateToken.mockReturnValueOnce('mockedToken');

            const result = await authService.registerSeeker(mockData);

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('token', 'mockedToken');
            expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(mockData.email);
            expect(userRepositoryMock.createSeeker).toHaveBeenCalled();
        });

        it('should throw ConflictError if email already exists', async () => {
            const mockData = {
                email: 'seeker@test.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe'
            };

            userRepositoryMock.findByEmail.mockResolvedValueOnce({ id: '1', email: 'seeker@test.com' } as any);

            await expect(authService.registerSeeker(mockData)).rejects.toThrow(ConflictError);
        });
    });

    describe('login', () => {
        it('should login successfully for valid seeker credentials', async () => {
            const mockUser = {
                id: '1',
                email: 'seeker@test.com',
                password: 'hashedPassword',
                role: Role.SEEKER,
                isBlocked: false
            } as any;

            userRepositoryMock.findByEmail.mockResolvedValueOnce(mockUser);
            authServiceMock.comparePassword.mockResolvedValueOnce(true);
            authServiceMock.generateToken.mockReturnValueOnce('mockedToken');

            const result = await authService.login('seeker@test.com', 'password123');

            expect(result.token).toBe('mockedToken');
            expect(result.user.id).toBe('1');
        });

        it('should throw ForbiddenError if user is blocked', async () => {
            const mockUser = {
                id: '1',
                email: 'blocked@test.com',
                password: 'hashedPassword',
                role: Role.SEEKER,
                isBlocked: true
            } as any;

            userRepositoryMock.findByEmail.mockResolvedValueOnce(mockUser);

            await expect(authService.login('blocked@test.com', 'password123')).rejects.toThrow(ForbiddenError);
        });

        it('should throw ForbiddenError if company is not approved', async () => {
            const mockUser = {
                id: '1',
                email: 'company@test.com',
                password: 'hashedPassword',
                role: Role.COMPANY,
                isBlocked: false
            } as any;

            userRepositoryMock.findByEmail.mockResolvedValueOnce(mockUser);
            userRepositoryMock.getCompanyProfile.mockResolvedValueOnce({ isApproved: false } as any);

            await expect(authService.login('company@test.com', 'password123')).rejects.toThrow(ForbiddenError);
        });
    });
});
