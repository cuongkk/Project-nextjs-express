// ADDED: Notification controller wiring service to Express
import { Response } from "express";
import { AccountRequest } from "../../interfaces/request.interface";
import * as notificationService from "./notification.service";

export const list = async (req: AccountRequest, res: Response) => {
  try {
    const result = await notificationService.getNotifications(req);
    res.json(result);
  } catch (error) {
    res.json({ code: "error", message: "Lấy danh sách thông báo thất bại!" });
  }
};

export const count = async (req: AccountRequest, res: Response) => {
  try {
    const result = await notificationService.getNotificationCount(req);
    res.json(result);
  } catch (error) {
    res.json({ code: "error", message: "Lấy số lượng thông báo thất bại!" });
  }
};

export const readAll = async (req: AccountRequest, res: Response) => {
  try {
    const result = await notificationService.markAllAsRead(req);
    res.json(result);
  } catch (error) {
    res.json({ code: "error", message: "Cập nhật thông báo thất bại!" });
  }
};

export const readOne = async (req: AccountRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const result = await notificationService.markAsRead(req, id);
    res.json(result);
  } catch (error) {
    res.json({ code: "error", message: "Cập nhật thông báo thất bại!" });
  }
};
