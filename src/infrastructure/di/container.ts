import { PrismaUserRepository } from '../database/PrismaUserRepository';
import { PrismaJobRepository } from '../database/PrismaJobRepository';
import { PrismaApplicationRepository } from '../database/PrismaApplicationRepository';
import { NotificationRepository } from '../../domain/repositories/NotificationRepository';
import { SocialRepository } from '../../domain/repositories/SocialRepository';
import { CloudinaryService } from '../services/CloudinaryService';
import { AuthService as ExternalAuthService } from '../services/AuthService';
import { EmailService } from '../services/EmailService';

import { AdminService } from '../../application/services/AdminService';
import { SeekerService } from '../../application/services/SeekerService';
import { CompanyService } from '../../application/services/CompanyService';
import { SocialService } from '../../application/services/SocialService';
import { NotificationService } from '../../application/services/NotificationService';
import { AuthService } from '../../application/services/AuthService';

import { AdminController } from '../../presentation/controllers/AdminController';
import { SeekerController } from '../../presentation/controllers/SeekerController';
import { CompanyController } from '../../presentation/controllers/CompanyController';
import { AuthController } from '../../presentation/controllers/AuthController';
import { SocialController } from '../../presentation/controllers/SocialController';
import { NotificationController } from '../../presentation/controllers/NotificationController';

class Container {
    // Repositories
    public userRepository = new PrismaUserRepository();
    public jobRepository = new PrismaJobRepository();
    public applicationRepository = new PrismaApplicationRepository();
    public notificationRepository = new NotificationRepository();
    public socialRepository = new SocialRepository();

    // Infrastructure Services
    public uploadService = new CloudinaryService();
    public externalAuthService = new ExternalAuthService();
    public emailService = new EmailService();

    // Application Services
    public adminService = new AdminService(this.userRepository, this.jobRepository, this.emailService);
    public seekerService = new SeekerService(this.userRepository, this.jobRepository, this.applicationRepository, this.uploadService);
    public companyService = new CompanyService(this.userRepository, this.jobRepository, this.applicationRepository, this.uploadService);
    public authService = new AuthService(this.userRepository, this.externalAuthService, this.emailService);
    public notificationService = new NotificationService(this.notificationRepository);
    public socialService = new SocialService(this.socialRepository, this.uploadService, this.notificationService);

    // Controllers
    public adminController = new AdminController(this.adminService);
    public seekerController = new SeekerController(this.seekerService);
    public companyController = new CompanyController(this.companyService);
    public authController = new AuthController(this.authService);
    public socialController = new SocialController(this.socialService);
    public notificationController = new NotificationController(this.notificationService);
}

export const container = new Container();
