import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import AccountUser from "../modules/user/user.model";
import { AccountRequest } from "../interfaces/request.interface";
import AccountCompany from "../modules/company/company.model";

export const verifyTokenUser = async (req: AccountRequest, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      res.json({
        code: "error",
        message: "Vui lòng gửi kèm theo token!",
      });
      return;
    }

    let decoded: jwt.JwtPayload | null = null;

    // Thử verify accessToken trước
    if (accessToken) {
      try {
        decoded = jwt.verify(accessToken, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
      } catch (err: any) {
        if (err.name !== "TokenExpiredError") {
          throw err;
        }
      }
    }

    // Nếu accessToken không hợp lệ hoặc hết hạn, thử dùng refreshToken
    let fromRefresh = false;
    if (!decoded && refreshToken) {
      decoded = jwt.verify(refreshToken, `${process.env.JWT_REFRESH_SECRET}`) as jwt.JwtPayload;
      fromRefresh = true;
    }

    if (!decoded) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.json({
        code: "error",
        message: "Token không hợp lệ!",
      });
      return;
    }

    const { id, email } = decoded;

    const existAccount = await AccountUser.findOne({
      _id: id,
      email: email,
    });

    if (!existAccount) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.json({
        code: "error",
        message: "Token không hợp lệ!",
      });
      return;
    }

    // Nếu xác thực bằng refreshToken thì cấp lại accessToken mới
    if (fromRefresh) {
      const newAccessToken = jwt.sign(
        {
          id: existAccount.id,
          email: existAccount.email,
        },
        `${process.env.JWT_SECRET}`,
        {
          expiresIn: "15m",
        },
      );

      res.cookie("accessToken", newAccessToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    req.account = existAccount;

    next();
  } catch (error) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({
      code: "error",
      message: error,
    });
  }
};

export const verifyTokenCompany = async (req: AccountRequest, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      res.json({
        code: "error",
        message: "Vui lòng gửi kèm theo token!",
      });
      return;
    }

    let decoded: jwt.JwtPayload | null = null;

    // Thử verify accessToken trước
    if (accessToken) {
      try {
        decoded = jwt.verify(accessToken, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
      } catch (err: any) {
        if (err.name !== "TokenExpiredError") {
          throw err;
        }
      }
    }

    // Nếu accessToken không hợp lệ hoặc hết hạn, thử dùng refreshToken
    let fromRefresh = false;
    if (!decoded && refreshToken) {
      decoded = jwt.verify(refreshToken, `${process.env.JWT_REFRESH_SECRET}`) as jwt.JwtPayload;
      fromRefresh = true;
    }

    if (!decoded) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.json({
        code: "error",
        message: "Token không hợp lệ!",
      });
      return;
    }

    const { id, email } = decoded;

    const existAccount = await AccountCompany.findOne({
      _id: id,
      email: email,
    });

    if (!existAccount) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.json({
        code: "error",
        message: "Token không hợp lệ!",
      });
      return;
    }

    // Nếu xác thực bằng refreshToken thì cấp lại accessToken mới
    if (fromRefresh) {
      const newAccessToken = jwt.sign(
        {
          id: existAccount.id,
          email: existAccount.email,
        },
        `${process.env.JWT_SECRET}`,
        {
          expiresIn: "15m",
        },
      );

      res.cookie("accessToken", newAccessToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    req.account = existAccount;

    next();
  } catch (error) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({
      code: "error",
      message: error,
    });
  }
};
