"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./presentation/app"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = require("./infrastructure/database/prisma");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        await prisma_1.prisma.$connect();
        console.log('Connected to MongoDB via Prisma');
        app_1.default.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
        });
    }
    catch (error) {
        console.error('Failed to connect to database', error);
        process.exit(1);
    }
};
startServer();
