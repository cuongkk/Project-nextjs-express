import { NextFunction, Request, Response } from "express";

type JsonBody = {
  code?: string;
  message?: string;
};

const inferStatusCode = (body: JsonBody) => {
  const message = `${body.message || ""}`.toLowerCase();

  if (message.includes("không thành công") || message.includes("thất bại") || message.includes("internal")) {
    return 500;
  }

  if (message.includes("unauthorized") || message.includes("đăng nhập") || message.includes("token")) {
    return 401;
  }

  if (message.includes("không có quyền") || message.includes("forbidden")) {
    return 403;
  }

  if (message.includes("không tìm thấy") || message.includes("not found")) {
    return 404;
  }

  if (message.includes("không hợp lệ") || message.includes("thiếu") || message.includes("invalid")) {
    return 400;
  }

  return 400;
};

export const responseNormalizeMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json.bind(res);

  res.json = ((body: JsonBody) => {
    if (body?.code === "error" && res.statusCode < 400) {
      res.status(inferStatusCode(body));
    }

    return originalJson(body);
  }) as Response["json"];

  next();
};
