"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    authUseCases;
    constructor(authUseCases) {
        this.authUseCases = authUseCases;
    }
    registerSeeker = async (req, res, next) => {
        try {
            const result = await this.authUseCases.registerSeeker(req.body);
            res.status(201).json({ success: true, data: result });
        }
        catch (error) {
            if (error.message === 'Email already in use')
                error.statusCode = 400;
            next(error);
        }
    };
    registerCompany = async (req, res, next) => {
        try {
            const result = await this.authUseCases.registerCompany(req.body);
            res.status(201).json({ success: true, data: result });
        }
        catch (error) {
            if (error.message === 'Email already in use')
                error.statusCode = 400;
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const result = await this.authUseCases.login(email, password);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            if (error.message === 'Invalid credentials' || error.message.includes('blocked')) {
                error.statusCode = 401;
            }
            next(error);
        }
    };
}
exports.AuthController = AuthController;
