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

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Cho phép gửi cookie từ frontend
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
