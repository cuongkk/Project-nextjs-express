"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.markAllAsRead = exports.getNotificationCount = exports.getNotifications = exports.createNotification = void 0;
const notification_model_1 = __importDefault(require("./notification.model"));
const createNotification = async (payload) => {
    const { receiverId, receiverType, type, title, message, data } = payload;
    await notification_model_1.default.create({
        receiverId,
        receiverType,
        type,
        title,
        message,
        data: data || {},
        read: false,
        readAt: null,
        expiresAt: null,
    });
};
exports.createNotification = createNotification;
const getNotifications = async (req) => {
    const userId = req.account.id;
    const now = new Date();
    const notifications = await notification_model_1.default.find({
        receiverId: userId,
        $or: [{ read: false }, { expiresAt: { $gt: now } }],
    })
        .sort({ createdAt: -1 })
        .limit(6);
    return {
        code: "success",
        message: "Lấy danh sách thông báo thành công!",
        notifications,
    };
};
exports.getNotifications = getNotifications;
const getNotificationCount = async (req) => {
    const userId = req.account.id;
    const now = new Date();
    const count = await notification_model_1.default.countDocuments({
        receiverId: userId,
        $or: [{ read: false }, { expiresAt: { $gt: now } }],
    });
    return {
        code: "success",
        message: "Lấy số lượng thông báo thành công!",
        count,
    };
};
exports.getNotificationCount = getNotificationCount;
const markAllAsRead = async (req) => {
    const userId = req.account.id;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1h
    await notification_model_1.default.updateMany({ receiverId: userId, read: false }, {
        $set: {
            read: true,
            readAt: now,
            expiresAt,
        },
    });
    return {
        code: "success",
        message: "Đã đánh dấu tất cả thông báo là đã đọc!",
    };
};
exports.markAllAsRead = markAllAsRead;
const markAsRead = async (req, id) => {
    const userId = req.account.id;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1h
    const updated = await notification_model_1.default.findOneAndUpdate({ _id: id, receiverId: userId }, { $set: { read: true, readAt: now, expiresAt } }, { new: true });
    if (!updated) {
        return { code: "error", message: "Không tìm thấy thông báo!" };
    }
    return { code: "success", message: "Đã đánh dấu đã đọc!" };
};
exports.markAsRead = markAsRead;
