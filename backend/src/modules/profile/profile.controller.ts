import { Response } from "express";
import { AccountRequest } from "../../interfaces/request.interface";
import * as profileService from "./profile.service";

export const me = async (req: AccountRequest, res: Response) => {
  try {
    const result = await profileService.me(req);
    res.json(result);
  } catch {
    res.json({ code: "error", message: "Lấy hồ sơ thất bại!" });
  }
};

export const patchMe = async (req: AccountRequest, res: Response) => {
  try {
    const result = await profileService.patchMe(req);
    res.json(result);
  } catch {
    res.json({ code: "error", message: "Cập nhật hồ sơ thất bại!" });
  }
};

export const uploadResume = async (req: AccountRequest, res: Response) => {
  try {
    const result = await profileService.uploadResume(req as any);
    res.json(result);
  } catch {
    res.json({ code: "error", message: "Tải CV thất bại!" });
  }
};
