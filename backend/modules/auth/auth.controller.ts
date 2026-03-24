import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as authService from "./auth.service";

export const check = async (req: Request, res: Response) => {
  try {
    const result = await authService.check(req);

    if ((result as any).clearCookies) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
    }

    if ((result as any).type === "user") {
      const { info, fromRefresh } = result as any;

      if (fromRefresh) {
        const newAccessToken = jwt.sign(
          {
            id: info.id,
            email: info.email,
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

      res.json({
        code: "success",
        message: "Token hợp lệ!",
        infoUser: info,
      });
      return;
    }

    if ((result as any).type === "company") {
      const { info, fromRefresh } = result as any;

      if (fromRefresh) {
        const newAccessToken = jwt.sign(
          {
            id: info.id,
            email: info.email,
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

      res.json({
        code: "success",
        message: "Token hợp lệ!",
        infoCompany: info,
      });
      return;
    }

    res.json(result as any);
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Token không hợp lệ!",
    });
  }
};

export const authCompanyCheck = async (req: Request, res: Response) => {
  try {
    const result = await authService.authCompanyCheck(req);

    if ((result as any).clearCookies) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.json({
        code: "error",
        message: "Token không hợp lệ!",
      });
      return;
    }

    const { infoCompany, fromRefresh } = result as any;

    if (fromRefresh) {
      const newAccessToken = jwt.sign(
        {
          id: infoCompany.id,
          email: infoCompany.email,
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

    res.json({
      code: "success",
      message: "Token hợp lệ!",
      infoCompany,
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Token không hợp lệ!",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({
    code: "success",
    message: "Đã đăng xuất!",
  });
};
