import { IUploadService } from '../../application/interfaces/IUploadService';
import fs from 'fs';
import path from 'path';

export class UploadService implements IUploadService {
    async uploadFile(file: any, folder: string): Promise<string> {
        // We are going to use multer in the presentation layer,
        // which will pass the file object here or we can just return the path
        // For local storage simulation, multer handles the upload, and we just return the path
        if (!file || !file.filename) {
            throw new Error('File not provided');
        }
        return `/uploads/${folder}/${file.filename}`;
    }

    async deleteFile(fileUrl: string): Promise<boolean> {
        try {
            const filePath = path.join(__dirname, '../../..', fileUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return true;
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }
}
