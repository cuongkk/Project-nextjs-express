"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    name: String,
    fullName: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ["candidate", "employer", "user", "company"],
        default: "candidate",
    },
    avatar: String,
}, {
    timestamps: true, // Tự động sinh ra trường createdAt và updatedAt
});
const AccountUser = mongoose_1.default.model("AccountUser", schema, "users");
exports.default = AccountUser;
