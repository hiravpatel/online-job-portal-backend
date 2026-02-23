"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    saltRounds = 10;
    jwtSecret = process.env.JWT_SECRET || 'secret';
    jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    async hashPassword(password) {
        return await bcrypt_1.default.hash(password, this.saltRounds);
    }
    async comparePassword(password, hash) {
        return await bcrypt_1.default.compare(password, hash);
    }
    generateToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
    }
    verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, this.jwtSecret);
    }
}
exports.AuthService = AuthService;
