"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class UploadService {
    async uploadFile(file, folder) {
        // We are going to use multer in the presentation layer,
        // which will pass the file object here or we can just return the path
        // For local storage simulation, multer handles the upload, and we just return the path
        if (!file || !file.filename) {
            throw new Error('File not provided');
        }
        return `/uploads/${folder}/${file.filename}`;
    }
    async deleteFile(fileUrl) {
        try {
            const filePath = path_1.default.join(__dirname, '../../..', fileUrl);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
            return true;
        }
        catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }
}
exports.UploadService = UploadService;
