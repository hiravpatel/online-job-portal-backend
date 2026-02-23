"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authRoutes_1 = require("./routes/authRoutes");
const seekerRoutes_1 = require("./routes/seekerRoutes");
const companyRoutes_1 = require("./routes/companyRoutes");
const adminRoutes_1 = require("./routes/adminRoutes");
const errorHandler_1 = require("./middlewares/errorHandler");
const swagger_1 = require("./swagger");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);
app.use('/uploads', express_1.default.static('uploads'));
(0, swagger_1.swaggerDocs)(app);
app.use('/api/auth', (0, authRoutes_1.setupAuthRoutes)());
app.use('/api/seeker', (0, seekerRoutes_1.setupSeekerRoutes)());
app.use('/api/company', (0, companyRoutes_1.setupCompanyRoutes)());
app.use('/api/admin', (0, adminRoutes_1.setupAdminRoutes)());
app.use(errorHandler_1.errorHandler);
exports.default = app;
