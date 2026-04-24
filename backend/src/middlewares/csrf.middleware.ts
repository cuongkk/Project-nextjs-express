import { NextFunction, Request, Response } from "express";

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const extractOrigin = (urlValue: string | undefined) => {
  if (!urlValue) return "";

  try {
    return new URL(urlValue).origin;
  } catch {
    return "";
  }
};

export const csrfOriginGuard = (allowedOrigins: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!UNSAFE_METHODS.has(req.method.toUpperCase())) {
      next();
      return;
    }

    const hasCookieAuth = Boolean(req.cookies?.accessToken || req.cookies?.refreshToken);
    if (!hasCookieAuth) {
      next();
      return;
    }

    const origin = extractOrigin(req.headers.origin as string | undefined);
    const refererOrigin = extractOrigin(req.headers.referer as string | undefined);
    const candidateOrigin = origin || refererOrigin;

    if (!candidateOrigin) {
      next();
      return;
    }

    if (!allowedOrigins.includes(candidateOrigin)) {
      res.status(403).json({
        code: "error",
        message: "CSRF validation failed",
      });
      return;
    }

    next();
  };
};
