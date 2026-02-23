export interface IUploadService {
    uploadFile(file: any, folder: string): Promise<string>;
    deleteFile(fileUrl: string): Promise<boolean>;
}
