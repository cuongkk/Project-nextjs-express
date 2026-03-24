import { Request, Response } from "express";
import { AccountRequest } from "../../interfaces/request.interface";
import * as userService from "./user.service";

export const registerPost = async (req: Request, res: Response) => {
  const result = await userService.registerPost(req);
  res.json(result);
};

export const loginPost = async (req: Request, res: Response) => {
  const result = await userService.loginPost(req);

  if ((result as any).tokens) {
    const { accessToken, refreshToken, isRemember } = (result as any).tokens;

    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    const refreshCookieOptions: any = {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    };

    if (isRemember) {
      refreshCookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000;
    }

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  }

  res.json({
    code: (result as any).code,
    message: (result as any).message,
    infoUser: (result as any).infoUser,
  });
};

export const forgotPasswordPost = async (req: Request, res: Response) => {
  const result = await userService.forgotPasswordPost(req);
  res.json(result);
};

export const resetPasswordPost = async (req: Request, res: Response) => {
  const result = await userService.resetPasswordPost(req);
  res.json(result);
};

// CV liên quan đến user đã được tách sang modules/cv/cv.controller

export const profilePatch = async (req: AccountRequest, res: Response) => {
  try {
    const result = await userService.profilePatch(req);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Cập nhật không thành công!",
    });
  }
};

export const changePasswordPatch = async (req: AccountRequest, res: Response) => {
  try {
    const result = await userService.changePasswordPatch(req);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Đổi mật khẩu không thành công!",
    });
  }
};
