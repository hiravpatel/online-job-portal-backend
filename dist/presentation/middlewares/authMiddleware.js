"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = void 0;
const authGuard = (authService) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = authService.verifyToken(token);
            req.user = decoded;
            next();
        }
        catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
};
exports.authGuard = authGuard;
