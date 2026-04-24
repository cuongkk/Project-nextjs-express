import type { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({
    code: "error",
    message: "Route not found",
  });
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : "Internal server error";
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;

  logger.error("Unhandled request error", err, {
    statusCode,
    requestId: res.locals.requestId,
  });

  res.status(statusCode).json({
    code: "error",
    message: process.env.NODE_ENV === "production" && statusCode >= 500 ? "Internal server error" : message,
  });
};
