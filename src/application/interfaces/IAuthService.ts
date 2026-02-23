export interface IAuthService {
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hash: string): Promise<boolean>;
    generateToken(payload: { id: string; role: string }): string;
    verifyToken(token: string): any;
}
