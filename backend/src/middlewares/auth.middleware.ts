import { NextFunction, Response } from "express";
import AccountUser from "../modules/user/user.model";
import AccountCompany from "../modules/company/company.model";
import { AccountRequest } from "../interfaces/request.interface";
import { verifyAccessToken, JwtPayload } from "../utils/token.util";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

const getTokenFromRequest = (req: AccountRequest): string | null => {
  const authHeader = req.headers["authorization"];
  if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }
  return null;
};

export const authenticate = async (req: AccountRequest, res: Response, next: NextFunction) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      res.status(401).json({
        code: "error",
        message: "Vui lòng đăng nhập!",
      });
      return;
    }

    const decoded = verifyAccessToken(token);

    req.user = decoded;

    // Giữ tương thích cũ: gán req.account theo role
    if (decoded.role === "user") {
      const account = await AccountUser.findById(decoded.id);
      if (!account) {
        res.status(401).json({ code: "error", message: "Token không hợp lệ!" });
        return;
      }
      req.account = account;
    } else if (decoded.role === "company") {
      const account = await AccountCompany.findById(decoded.id);
      if (!account) {
        res.status(401).json({ code: "error", message: "Token không hợp lệ!" });
        return;
      }
      req.account = account;
    }

    next();
  } catch (error) {
    res.status(401).json({
      code: "error",
      message: "Token không hợp lệ!",
    });
  }
};

export const verifyTokenUser = async (req: AccountRequest, res: Response, next: NextFunction) => {
  await authenticate(req, res, (err?: any) => {
    if (err) return;
    if (req.user?.role !== "user") {
      res.status(403).json({ code: "error", message: "Không có quyền truy cập!" });
      return;
    }
    next();
  });
};

export const verifyTokenCompany = async (req: AccountRequest, res: Response, next: NextFunction) => {
  await authenticate(req, res, (err?: any) => {
    if (err) return;
    if (req.user?.role !== "company") {
      res.status(403).json({ code: "error", message: "Không có quyền truy cập!" });
      return;
    }
    next();
  });
};
