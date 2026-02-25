import { User, SeekerProfile, CompanyProfile, Role } from '@prisma/client';

export interface UserRepository {
    createSeeker(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>, profile: Omit<SeekerProfile, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<User>;
    createCompany(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>, profile: Omit<CompanyProfile, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<User>;
    createAdmin(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;

    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByResetPasswordToken(token: string): Promise<User | null>;
    updateUserResetToken(userId: string, token: string | null, expires: Date | null): Promise<User>;
    updateUserPasswordAndClearToken(userId: string, hashedPw: string): Promise<User>;

    getSeekerProfile(userId: string): Promise<SeekerProfile | null>;
    getCompanyProfile(userId: string): Promise<CompanyProfile | null>;
    getAllCompanies(options?: { skip?: number; take?: number }): Promise<CompanyProfile[]>;
    getPendingCompanies(options?: { skip?: number; take?: number }): Promise<CompanyProfile[]>;

    updateSeekerProfile(userId: string, data: Partial<SeekerProfile>): Promise<SeekerProfile>;
    updateCompanyProfile(userId: string, data: Partial<CompanyProfile>): Promise<CompanyProfile>;

    getAllUsers(options?: { role?: Role; skip?: number; take?: number }): Promise<User[]>;
    updateUserStatus(userId: string, isBlocked: boolean): Promise<User>;
}
