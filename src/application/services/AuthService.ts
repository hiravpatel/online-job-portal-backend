import { UserRepository } from '../../domain/repositories/UserRepository';
import { IAuthService } from '../interfaces/IAuthService';
import { Role } from '@prisma/client';
import { ConflictError, UnauthorizedError, ForbiddenError } from '../../domain/errors/CustomErrors';
import { AppError } from '../../domain/errors/AppError';
import { EmailService } from '../../infrastructure/services/EmailService';
import crypto from 'crypto';

export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private authService: IAuthService,
        private emailService: EmailService
    ) { }

    async registerSeeker(data: any) {
        if (!data.email || !data.password || !data.firstName || !data.lastName) {
            throw new AppError('Missing required fields', 400);
        }

        const existing = await this.userRepository.findByEmail(data.email);
        if (existing) throw new ConflictError('Email already in use');

        const hashedPassword = await this.authService.hashPassword(data.password);
        const user = {
            email: data.email,
            password: hashedPassword,
            role: Role.SEEKER,
            isVerified: false,
            isBlocked: false,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        };

        const profile = {
            firstName: data.firstName,
            lastName: data.lastName,
            skills: data.skills || [],
            experience: data.experience || 0,
            education: data.education || null,
            photoUrl: null,
            resumeUrl: null,
            linkedinUrl: null,
            githubUrl: null,
        };

        const newUser = await this.userRepository.createSeeker(user, profile);
        const token = this.authService.generateToken({ id: newUser.id, role: newUser.role });

        // Send welcome email asynchronously without blocking the response
        this.emailService.sendSeekerRegistrationEmail(newUser.email, profile.firstName, `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`).catch(console.error);

        return { user: newUser, token };
    }

    async registerCompany(data: any) {
        if (!data.email || !data.password || !data.companyName || !data.contactNumber || !data.industry) {
            throw new AppError('Missing required fields', 400);
        }

        const existing = await this.userRepository.findByEmail(data.email);
        if (existing) throw new ConflictError('Email already in use');

        const hashedPassword = await this.authService.hashPassword(data.password);
        const user = {
            email: data.email,
            password: hashedPassword,
            role: Role.COMPANY,
            isVerified: false,
            isBlocked: false,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        };

        const profile = {
            companyName: data.companyName,
            location: data.location || null,
            industry: data.industry,
            contactNumber: data.contactNumber,
            isApproved: false,
            logoUrl: null,
            description: data.description || null,
            website: data.website || null,
            size: data.size || null,
        };

        const newUser = await this.userRepository.createCompany(user, profile);

        // Send company registration acknowledgement email asynchronously
        this.emailService.sendCompanyRegistrationEmail(newUser.email, profile.companyName).catch(console.error);

        return {
            user: newUser,
            message: 'Company registered successfully. Please wait for admin approval before logging in.'
        };
    }

    async login(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new UnauthorizedError('Invalid credentials');

        if (user.isBlocked) throw new ForbiddenError('User is blocked by admin');

        if (user.role === Role.COMPANY) {
            const companyProfile = await this.userRepository.getCompanyProfile(user.id);
            if (companyProfile && !companyProfile.isApproved) {
                throw new ForbiddenError('Company is not approved yet. Please wait for admin approval.');
            }
        }

        const isMatch = await this.authService.comparePassword(password, user.password);
        if (!isMatch) throw new UnauthorizedError('Invalid credentials');

        const token = this.authService.generateToken({ id: user.id, role: user.role });
        return { user, token };
    }

    async forgotPassword(email: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            return { message: 'If that email address is in our database, we will send you an email to reset your password.' };
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await this.userRepository.updateUserResetToken(user.id, passwordResetToken, passwordResetExpires);

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        await this.emailService.sendPasswordResetEmail(user.email, resetUrl);

        return { message: 'If that email address is in our database, we will send you an email to reset your password.' };
    }

    async resetPassword(token: string, newPassword: string) {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await this.userRepository.findByResetPasswordToken(hashedToken);

        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw new AppError('Invalid or expired password reset token', 400);
        }

        const hashedPassword = await this.authService.hashPassword(newPassword);
        await this.userRepository.updateUserPasswordAndClearToken(user.id, hashedPassword);

        return { message: 'Password has been successfully reset.' };
    }
}
