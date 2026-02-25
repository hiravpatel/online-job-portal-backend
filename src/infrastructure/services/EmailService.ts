import nodemailer from 'nodemailer';
import { passwordResetTemplate } from './templates/passwordResetTemplate';
import { companyApprovalTemplate } from './templates/companyApprovalTemplate';
import { companyRegistrationTemplate } from './templates/companyRegistrationTemplate';
import { seekerRegistrationTemplate } from './templates/seekerRegistrationTemplate';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Password Reset Request - Job Portal',
      html: passwordResetTemplate(resetLink),
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendCompanyApprovalEmail(to: string, companyName: string, loginUrl: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Your Company Account has been Approved! - Job Portal',
      html: companyApprovalTemplate(companyName, loginUrl),
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send company approval email');
    }
  }

  async sendCompanyRegistrationEmail(to: string, companyName: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Company Registration Received - Job Portal',
      html: companyRegistrationTemplate(companyName),
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send company registration email');
    }
  }

  async sendSeekerRegistrationEmail(to: string, firstName: string, loginUrl: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Welcome to Job Portal!',
      html: seekerRegistrationTemplate(firstName, loginUrl),
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send seeker registration email');
    }
  }
}
