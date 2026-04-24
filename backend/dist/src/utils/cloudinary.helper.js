"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (!fs_1.default.existsSync("uploads")) {
            fs_1.default.mkdirSync("uploads", { recursive: true });
        }
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        cb(null, Date.now() + ext);
    },
});
const ALLOWED_FILE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".pdf", ".doc", ".docx"]);
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 8 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (!ALLOWED_FILE_EXTENSIONS.has(ext)) {
            cb(new Error("Unsupported file type"));
            return;
        }
        cb(null, true);
    },
});
// upload lên cloudinary
const uploadToCloudinary = async (filePath) => {
    return await cloudinary_1.v2.uploader.upload(filePath, {
        folder: "uploads",
        resource_type: "auto",
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
