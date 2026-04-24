import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

const maskSensitive = (value: string) => {
  if (!value) return value;
  if (value.length <= 6) return "***";
  return `${value.slice(0, 3)}***${value.slice(-3)}`;
};

export const requestLogMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    const status = res.statusCode;
    const level = status >= 500 ? "error" : status >= 400 ? "warn" : "info";

    const payload = {
      requestId: res.locals.requestId,
      method: req.method,
      path: req.originalUrl,
      status,
      durationMs: Number(durationMs.toFixed(2)),
      ip: maskSensitive(req.ip || ""),
      userAgent: req.headers["user-agent"] || "",
    };

    if (level === "error") {
      logger.error("Request failed", undefined, payload);
      return;
    }

    if (level === "warn") {
      logger.warn("Request warning", payload);
      return;
    }

    logger.info("Request completed", payload);
  });

  next();
};
