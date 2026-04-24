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
const mongoose_1 = __importDefault(require("mongoose"));
const index_route_1 = __importDefault(require("./src/routes/index.route"));
const database_config_1 = require("./src/configs/database.config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_middleware_1 = require("./src/middlewares/error.middleware");
const logger_1 = require("./src/utils/logger");
const socket_1 = require("./src/utils/socket");
const env_config_1 = require("./src/configs/env.config");
const request_id_middleware_1 = require("./src/middlewares/request-id.middleware");
const request_log_middleware_1 = require("./src/middlewares/request-log.middleware");
const response_middleware_1 = require("./src/middlewares/response.middleware");
const csrf_middleware_1 = require("./src/middlewares/csrf.middleware");
// Load biến môi trường từ file .env
dotenv_1.default.config();
const env = (0, env_config_1.validateAndLoadEnv)();
// Kết nối đến cơ sở dữ liệu MongoDB
const bootstrap = async () => {
    await (0, database_config_1.connectDB)();
    const httpServer = (0, http_1.createServer)(app);
    (0, socket_1.initSocket)(httpServer, allowedOrigins);
    const server = httpServer.listen(port, () => {
        logger_1.logger.info(`Website đang chạy trên cổng ${port}`);
    });
    let shuttingDown = false;
    const shutdown = (signal) => {
        if (shuttingDown)
            return;
        shuttingDown = true;
        logger_1.logger.warn("Received shutdown signal", { signal });
        server.close(async () => {
            try {
                await mongoose_1.default.connection.close(false);
                logger_1.logger.info("Shutdown completed");
                process.exit(0);
            }
            catch (error) {
                logger_1.logger.error("Shutdown failed", error);
                process.exit(1);
            }
        });
    };
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("uncaughtException", (error) => {
        logger_1.logger.error("Uncaught exception", error);
    });
    process.on("unhandledRejection", (reason) => {
        logger_1.logger.error("Unhandled rejection", reason);
    });
};
const app = (0, express_1.default)();
const port = env.PORT;
const clientUrls = (env.CLIENT_URL || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
const allowedOrigins = ["http://localhost:3000", "http://localhost", ...clientUrls];
if (clientUrls.length === 0) {
    logger_1.logger.warn("CLIENT_URL is not set. Only localhost origins are allowed.");
}
app.set("trust proxy", 1);
app.use(request_id_middleware_1.requestIdMiddleware);
app.use(request_log_middleware_1.requestLogMiddleware);
app.use(response_middleware_1.responseNormalizeMiddleware);
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
app.use((0, csrf_middleware_1.csrfOriginGuard)(allowedOrigins));
// Cho phép Express xử lý dữ liệu JSON
app.use(express_1.default.json({ limit: "1mb" }));
// Cấu hình lấy cookie
app.use((0, cookie_parser_1.default)());
// Thiết lập routes
app.get("/health", (_req, res) => {
    res.json({
        code: "success",
        status: "ok",
    });
});
app.get("/ready", (_req, res) => {
    const dbReady = mongoose_1.default.connection.readyState === 1;
    if (!dbReady) {
        res.status(503).json({
            code: "error",
            status: "not_ready",
        });
        return;
    }
    res.json({
        code: "success",
        status: "ready",
    });
});
app.get("/live", (_req, res) => {
    res.json({
        code: "success",
        status: "alive",
    });
});
app.use("/", index_route_1.default);
app.use(error_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
bootstrap();
