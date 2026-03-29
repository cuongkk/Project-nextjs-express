// ADDED: Notification service for creating and querying notifications
import Notification from "./notification.model";
import { AccountRequest } from "../../interfaces/request.interface";

export type NotificationType = "CV_ACCEPTED" | "NEW_APPLICATION"; // ADDED

interface CreateNotificationPayload {
  // ADDED
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export const createNotification = async (payload: CreateNotificationPayload) => {
  const { userId, type, title, message, data } = payload;

  await Notification.create({
    userId,
    type,
    title,
    message,
    data: data || {},
    read: false,
    readAt: null,
    expiresAt: null,
  });
};

// ADDED: list latest notifications (max 6) for current account
export const getNotifications = async (req: AccountRequest) => {
  const userId = req.account.id;

  const now = new Date();

  const notifications = await Notification.find({
    userId,
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

// ADDED: count notifications for badge
export const getNotificationCount = async (req: AccountRequest) => {
  const userId = req.account.id;
  const now = new Date();

  const count = await Notification.countDocuments({
    userId,
    $or: [{ read: false }, { expiresAt: { $gt: now } }],
  });

  return {
    code: "success",
    message: "Lấy số lượng thông báo thành công!",
    count,
  };
};

// ADDED: mark all as read and set expiry +1h
export const markAllAsRead = async (req: AccountRequest) => {
  const userId = req.account.id;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1h

  await Notification.updateMany(
    { userId, read: false },
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
