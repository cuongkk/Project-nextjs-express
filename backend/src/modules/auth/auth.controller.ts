import { Request, Response } from "express";
import * as authService from "./auth.service";
import { AccountRequest } from "../../interfaces/request.interface";
import { logger } from "../../utils/logger";

const buildAuthCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: isProduction ? ("none" as const) : ("lax" as const),
    secure: isProduction,
  };
};

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req);
    res.json(result as any);
  } catch (error) {
    logger.error("Register failed", error);
    res.status(500).json({
      code: "error",
      message: "Đăng ký không thành công!",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req);

    if ((result as any).tokens) {
      const { accessToken, refreshToken, isRemember } = (result as any).tokens;
      const baseCookieOptions = buildAuthCookieOptions();

      res.cookie("accessToken", accessToken, {
        maxAge: 15 * 60 * 1000,
        ...baseCookieOptions,
      });

      const refreshCookieOptions: any = {
        ...baseCookieOptions,
      };

      if (isRemember) {
        refreshCookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000;
      }

      res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    }

    const role = (result as any).role as "user" | "company" | "admin" | undefined;
    const info = (result as any).info as any;

    let infoUser: any = null;
    let infoCompany: any = null;

    if (role === "user") {
      infoUser = info ?? null;
    } else if (role === "company") {
      infoCompany = info ?? null;
    }

    res.json({
      code: (result as any).code,
      message: (result as any).message,
      role,
      infoUser,
      infoCompany,
    });
  } catch (error) {
    logger.error("Login failed", error);
    res.status(500).json({
      code: "error",
      message: "Đăng nhập không thành công!",
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const result = await authService.refreshToken(req);

    if ((result as any).tokens) {
      const { accessToken, refreshToken } = (result as any).tokens;
      const baseCookieOptions = buildAuthCookieOptions();

      res.cookie("accessToken", accessToken, {
        maxAge: 15 * 60 * 1000,
        ...baseCookieOptions,
      });

      const refreshCookieOptions: any = {
        ...baseCookieOptions,
      };

      res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    }

    res.json(result as any);
  } catch (error) {
    logger.error("Refresh token failed", error);
    res.status(500).json({
      code: "error",
      message: "Làm mới token không thành công!",
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const result = await authService.forgotPassword(req);
    res.json(result as any);
  } catch (error) {
    logger.error("Forgot password failed", error);
    res.status(500).json({
      code: "error",
      message: "Gửi OTP không thành công!",
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const result = await authService.verifyEmail(req);
    res.json(result as any);
  } catch (error) {
    logger.error("Verify email failed", error);
    res.status(500).json({
      code: "error",
      message: "Xác thực email không thành công!",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const result = await authService.resetPassword(req);
    res.json(result as any);
  } catch (error) {
    logger.error("Reset password failed", error);
    res.status(500).json({
      code: "error",
      message: "Đặt lại mật khẩu không thành công!",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const result = await authService.logout(req);
    const cookieOptions = buildAuthCookieOptions();
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    res.json(result as any);
  } catch (error) {
    logger.error("Logout failed", error);
    const cookieOptions = buildAuthCookieOptions();
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    res.status(500).json({
      code: "error",
      message: "Đăng xuất không thành công!",
    });
  }
};

export const changePassword = async (req: AccountRequest, res: Response) => {
  try {
    const result = await authService.changePasswordPatch(req);
    res.json(result);
  } catch (error) {
    logger.error("Change password failed", error);
    res.status(500).json({
      code: "error",
      message: "Đổi mật khẩu không thành công!",
    });
  }
};

export const me = async (req: any, res: Response) => {
  try {
    const userPayload = req.user;
    const account = req.account;

    const result = await authService.me(userPayload, account);

    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error("Get current user failed", error);
    return res.status(500).json({
      code: "error",
      message: "Lấy thông tin đăng nhập không thành công!",
    });
  }
};
