"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    receiverId: String,
    receiverType: {
        type: String,
        enum: ["user", "company"],
    },
    type: {
        type: String,
        enum: ["application_status", "new_message", "CV_ACCEPTED", "NEW_APPLICATION"],
        default: null,
    },
    title: String,
    message: String,
    data: Object,
    read: {
        type: Boolean,
        default: false,
    },
    readAt: Date,
    expiresAt: Date,
}, { timestamps: true });
const Notification = mongoose_1.default.model("Notification", schema, "notifications");
exports.default = Notification;
