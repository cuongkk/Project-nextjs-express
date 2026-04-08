"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const index_route_1 = __importDefault(require("./src/routes/index.route"));
const database_config_1 = require("./src/configs/database.config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Load biến môi trường từ file .env
dotenv_1.default.config();
// Kết nối đến cơ sở dữ liệu MongoDB
(0, database_config_1.connectDB)();
const app = (0, express_1.default)();
const port = 5000;
const allowedOrigins = [
    "http://localhost:3000", // dev
    "http://localhost", // nginx
    "https://yourdomain.com", // production
];
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
app.use(express_1.default.json());
// Cấu hình lấy cookie
app.use((0, cookie_parser_1.default)());
// Thiết lập routes
app.use("/", index_route_1.default);
app.listen(port, () => {
    console.log(`Website đang chạy trên cổng ${port}`);
});
