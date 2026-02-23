import { IAuthService } from '../../application/interfaces/IAuthService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService implements IAuthService {
    private readonly saltRounds = 10;
    private readonly jwtSecret = process.env.JWT_SECRET || 'secret';
    private readonly jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    generateToken(payload: { id: string; role: string }): string {
        return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn as any });
    }

    verifyToken(token: string): any {
        return jwt.verify(token, this.jwtSecret);
    }
}
