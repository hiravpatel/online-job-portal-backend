export class ApiResponse<T = any> {
    statusCode: number;
    message: string;
    data?: T;

    constructor(statusCode: number, message: string, data?: T) {
        this.statusCode = statusCode;
        this.message = message;
        if (data !== undefined) {
            this.data = data;
        }
    }

    static success<T>(data: T, message: string = 'Success') {
        return new ApiResponse<T>(200, message, data);
    }

    static created<T>(data: T, message: string = 'Created successfully') {
        return new ApiResponse<T>(201, message, data);
    }

    static error(message: string, statusCode: number = 500) {
        return new ApiResponse<null>(statusCode, message);
    }
}
