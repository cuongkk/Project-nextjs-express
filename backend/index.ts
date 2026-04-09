import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./src/routes/index.route";
import { connectDB } from "./src/configs/database.config";
import cookieParser from "cookie-parser";
import { errorHandler, notFoundHandler } from "./src/middlewares/error.middleware";
import { logger } from "./src/utils/logger";

// Load biến môi trường từ file .env
dotenv.config();

// Kết nối đến cơ sở dữ liệu MongoDB
const bootstrap = async () => {
  await connectDB();

  app.listen(port, () => {
    logger.info(`Website đang chạy trên cổng ${port}`);
  });
};

const app = express();
const port = Number(process.env.PORT) || 5000;

const clientUrls = (process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

const allowedOrigins = ["http://localhost:3000", "http://localhost", ...clientUrls];

if (clientUrls.length === 0) {
  logger.warn("CLIENT_URL is not set. Only localhost origins are allowed.");
}

app.set("trust proxy", 1);
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
// Cho phép Express xử lý dữ liệu JSON
app.use(express.json({ limit: "1mb" }));

// Cấu hình lấy cookie
app.use(cookieParser());

// Thiết lập routes
app.use("/", routes);
app.use(notFoundHandler);
app.use(errorHandler);

bootstrap();
