import { Request, Response } from "express";
import { AccountRequest } from "../../interfaces/request.interface";
import * as companyService from "./company.service";

export const registerPost = async (req: Request, res: Response) => {
  const result = await companyService.registerPost(req);
  res.json(result);
};

export const loginPost = async (req: Request, res: Response) => {
  const result = await companyService.loginPost(req);

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
    infoCompany: (result as any).infoCompany,
  });
};

export const forgotPasswordPost = async (req: Request, res: Response) => {
  const result = await companyService.forgotPasswordPost(req);
  res.json(result);
};

export const resetPasswordPost = async (req: Request, res: Response) => {
  const result = await companyService.resetPasswordPost(req);
  res.json(result);
};

export const profilePatch = async (req: AccountRequest, res: Response) => {
  try {
    const result = await companyService.profilePatch(req);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Cập nhật không thành công!",
    });
  }
};

export const createJobPost = async (req: AccountRequest, res: Response) => {
  try {
    const result = await companyService.createJobPost(req);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!",
    });
  }
};

export const listJob = async (req: AccountRequest, res: Response) => {
  const result = await companyService.listJob(req);
  res.json(result);
};

export const editJob = async (req: AccountRequest, res: Response) => {
  const result = await companyService.editJob(req);
  res.json(result);
};

export const editJobPatch = async (req: AccountRequest, res: Response) => {
  const result = await companyService.editJobPatch(req);
  res.json(result);
};

export const deleteJobDel = async (req: AccountRequest, res: Response) => {
  const result = await companyService.deleteJobDel(req);
  res.json(result);
};

export const list = async (req: Request, res: Response) => {
  const result = await companyService.list(req);
  res.json(result);
};

export const detail = async (req: Request, res: Response) => {
  try {
    const result = await companyService.detail(req);
    res.json(result);
  } catch (error) {
    res.json({
      code: "error",
      message: "Thất bại!",
    });
  }
};

// Các hành động với CV đã được tách sang modules/cv/cv.controller
