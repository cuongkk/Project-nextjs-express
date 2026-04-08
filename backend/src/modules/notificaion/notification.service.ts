import Notification from "./notification.model";
import { AccountRequest } from "../../interfaces/request.interface";

export type NotificationType = "CV_ACCEPTED" | "NEW_APPLICATION";

interface CreateNotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export const createNotification = async (payload: CreateNotificationPayload) => {
  const { userId, type, title, message, data } = payload;

  await Notification.create({
    receiverId: userId,
    receiverType: type,
    title,
    message,
    data: data || {},
    read: false,
    readAt: null,
    expiresAt: null,
  });
};

export const getNotifications = async (req: AccountRequest) => {
  const userId = req.account.id;

  const now = new Date();

  const notifications = await Notification.find({
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

export const getNotificationCount = async (req: AccountRequest) => {
  const userId = req.account.id;
  const now = new Date();

  const count = await Notification.countDocuments({
    receiverId: userId,
    $or: [{ read: false }, { expiresAt: { $gt: now } }],
  });

  return {
    code: "success",
    message: "Lấy số lượng thông báo thành công!",
    count,
  };
};

export const markAllAsRead = async (req: AccountRequest) => {
  const userId = req.account.id;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1h

  await Notification.updateMany(
    { receiverId: userId, read: false },
    {
      $set: {
        read: true,
        readAt: now,
        expiresAt,
      },
    },
  );

  return {
    code: "success",
    message: "Đã đánh dấu tất cả thông báo là đã đọc!",
  };
};
