import { NextFunction, Response } from "express";
import { AccountRequest } from "../interfaces/request.interface";

export const isUser = (req: AccountRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "user") {
    res.status(403).json({ code: "error", message: "Không có quyền truy cập!" });
    return;
  }
  next();
};

export const isCompany = (req: AccountRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "company") {
    res.status(403).json({ code: "error", message: "Không có quyền truy cập!" });
    return;
  }
  next();
};

export const isAdmin = (req: AccountRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ code: "error", message: "Không có quyền truy cập!" });
    return;
  }
  next();
};
