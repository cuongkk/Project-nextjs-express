import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./src/routes/index.route";
import { connectDB } from "./src/configs/database.config";
import cookieParser from "cookie-parser";

// Load biến môi trường từ file .env
dotenv.config();

// Kết nối đến cơ sở dữ liệu MongoDB
connectDB();

const app = express();
const port = 5000;

const allowedOrigins = ["http://localhost:3000", "http://localhost", "https://it-job-five.vercel.app"];

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
app.use(express.json());

// Cấu hình lấy cookie
app.use(cookieParser());

// Thiết lập routes
app.use("/", routes);

app.listen(port, () => {
  console.log(`Website đang chạy trên cổng ${port}`);
});
