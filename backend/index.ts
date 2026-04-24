import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import mongoose from "mongoose";
import routes from "./src/routes/index.route";
import { connectDB } from "./src/configs/database.config";
import cookieParser from "cookie-parser";
import { errorHandler, notFoundHandler } from "./src/middlewares/error.middleware";
import { logger } from "./src/utils/logger";
import { initSocket } from "./src/utils/socket";
import { validateAndLoadEnv } from "./src/configs/env.config";
import { requestIdMiddleware } from "./src/middlewares/request-id.middleware";
import { requestLogMiddleware } from "./src/middlewares/request-log.middleware";
import { responseNormalizeMiddleware } from "./src/middlewares/response.middleware";
import { csrfOriginGuard } from "./src/middlewares/csrf.middleware";

// Load biến môi trường từ file .env
dotenv.config();
const env = validateAndLoadEnv();

// Kết nối đến cơ sở dữ liệu MongoDB
const bootstrap = async () => {
  await connectDB();

  const httpServer = createServer(app);
  initSocket(httpServer, allowedOrigins);

  const server = httpServer.listen(port, () => {
    logger.info(`Website đang chạy trên cổng ${port}`);
  });

  let shuttingDown = false;
  const shutdown = (signal: NodeJS.Signals) => {
    if (shuttingDown) return;
    shuttingDown = true;

    logger.warn("Received shutdown signal", { signal });

    server.close(async () => {
      try {
        await mongoose.connection.close(false);
        logger.info("Shutdown completed");
        process.exit(0);
      } catch (error) {
        logger.error("Shutdown failed", error);
        process.exit(1);
      }
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("uncaughtException", (error) => {
    logger.error("Uncaught exception", error);
  });
  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled rejection", reason);
  });
};

const app = express();
const port = env.PORT;

const clientUrls = (env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

const allowedOrigins = ["http://localhost:3000", "http://localhost", ...clientUrls];

if (clientUrls.length === 0) {
  logger.warn("CLIENT_URL is not set. Only localhost origins are allowed.");
}

app.set("trust proxy", 1);
app.use(requestIdMiddleware);
app.use(requestLogMiddleware);
app.use(responseNormalizeMiddleware);
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(csrfOriginGuard(allowedOrigins));
// Cho phép Express xử lý dữ liệu JSON
app.use(express.json({ limit: "1mb" }));

// Cấu hình lấy cookie
app.use(cookieParser());

// Thiết lập routes
app.get("/health", (_req, res) => {
  res.json({
    code: "success",
    status: "ok",
  });
});

app.get("/ready", (_req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
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

app.use("/", routes);
app.use(notFoundHandler);
app.use(errorHandler);

bootstrap();
