import { v2 as cloudinary } from 'cloudinary';
import { IUploadService } from '../../application/interfaces/IUploadService';
import fs from 'fs';

export class CloudinaryService implements IUploadService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }

    async uploadFile(file: any, folder: string): Promise<string> {
        if (!file || !file.path) {
            throw new Error('File not provided or invalid');
        }

        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: `job-portal/${folder}`
            });

            // Clean up the local file after uploading
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }

            return result.secure_url;
        } catch (error) {
            console.error('Cloudinary upload error:', error);

            // Attempt to clean up even on error
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }

            throw new Error('Failed to upload file to Cloudinary');
        }
    }

    async deleteFile(fileUrl: string): Promise<boolean> {
        try {
            // Extract the public ID from the URL
            const urlParts = fileUrl.split('/');
            const fileNameWithExtension = urlParts[urlParts.length - 1];
            const folderStr = urlParts[urlParts.length - 2];
            const publicId = `job-portal/${folderStr}/${fileNameWithExtension.split('.')[0]}`;

            await cloudinary.uploader.destroy(publicId);
            return true;
        } catch (error) {
            console.error('Cloudinary delete error:', error);
            return false;
        }
    }
}
