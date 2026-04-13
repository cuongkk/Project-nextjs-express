"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const http_1 = require("http");
const index_route_1 = __importDefault(require("./src/routes/index.route"));
const database_config_1 = require("./src/configs/database.config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_middleware_1 = require("./src/middlewares/error.middleware");
const logger_1 = require("./src/utils/logger");
const socket_1 = require("./src/utils/socket");
// Load biến môi trường từ file .env
dotenv_1.default.config();
// Kết nối đến cơ sở dữ liệu MongoDB
const bootstrap = async () => {
    await (0, database_config_1.connectDB)();
    const httpServer = (0, http_1.createServer)(app);
    (0, socket_1.initSocket)(httpServer, allowedOrigins);
    httpServer.listen(port, () => {
        logger_1.logger.info(`Website đang chạy trên cổng ${port}`);
    });
};
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 5000;
const clientUrls = (process.env.CLIENT_URL || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
const allowedOrigins = ["http://localhost:3000", "http://localhost", ...clientUrls];
if (clientUrls.length === 0) {
    logger_1.logger.warn("CLIENT_URL is not set. Only localhost origins are allowed.");
}
app.set("trust proxy", 1);
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false,
}));
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
}));
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
// Cho phép Express xử lý dữ liệu JSON
app.use(express_1.default.json({ limit: "1mb" }));
// Cấu hình lấy cookie
app.use((0, cookie_parser_1.default)());
// Thiết lập routes
app.use("/", index_route_1.default);
app.use(error_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
bootstrap();
