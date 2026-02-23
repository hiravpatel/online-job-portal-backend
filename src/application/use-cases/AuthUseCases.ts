import { UserRepository } from '../../domain/repositories/UserRepository';
import { IAuthService } from '../interfaces/IAuthService';
import { Role } from '@prisma/client';

export class AuthUseCases {
    constructor(
        private userRepository: UserRepository,
        private authService: IAuthService
    ) { }

    async registerSeeker(data: any) {
        const existing = await this.userRepository.findByEmail(data.email);
        if (existing) throw new Error('Email already in use');

        const hashedPassword = await this.authService.hashPassword(data.password);
        const user = {
            email: data.email,
            password: hashedPassword,
            role: Role.SEEKER,
            isVerified: false,
            isBlocked: false,
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
        return { user: newUser, token };
    }

    async registerCompany(data: any) {
        const existing = await this.userRepository.findByEmail(data.email);
        if (existing) throw new Error('Email already in use');

        const hashedPassword = await this.authService.hashPassword(data.password);
        const user = {
            email: data.email,
            password: hashedPassword,
            role: Role.COMPANY,
            isVerified: false,
            isBlocked: false,
        };

        const profile = {
            companyName: data.companyName,
            location: data.location,
            industry: data.industry,
            logoUrl: null,
            description: data.description || null,
            website: data.website || null,
            size: data.size || null,
        };

        const newUser = await this.userRepository.createCompany(user, profile);
        const token = this.authService.generateToken({ id: newUser.id, role: newUser.role });
        return { user: newUser, token };
    }

    async login(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error('Invalid credentials');

        if (user.isBlocked) throw new Error('User is blocked by admin');

        const isMatch = await this.authService.comparePassword(password, user.password);
        if (!isMatch) throw new Error('Invalid credentials');

        const token = this.authService.generateToken({ id: user.id, role: user.role });
        return { user, token };
    }
}
