import { Request, Response } from "express";
import { AccountRequest } from "../../interfaces/request.interface";
import * as jobService from "./job.service";

export const list = async (req: AccountRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      code: "error",
      message: "Unauthorized",
    });
  }

  const result = await jobService.list(req.user.id);
  res.json(result);
};

export const detail = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await jobService.detail(id);
  res.json(result);
};

export const create = async (req: AccountRequest, res: Response) => {
  try {
    const result = await jobService.create(req);
    res.json(result);
  } catch (error) {
    res.json({ code: "error", message: "Dữ liệu không hợp lệ!" });
  }
};

export const update = async (req: AccountRequest, res: Response) => {
  try {
    const result = await jobService.update(req);
    res.json(result);
  } catch (error) {
    res.json({ code: "error", message: "Cập nhật không thành công!" });
  }
};

export const remove = async (req: AccountRequest, res: Response) => {
  try {
    const result = await jobService.remove(req);
    res.json(result);
  } catch (error) {
    res.json({ code: "error", message: "Thất bại!" });
  }
};

// Nộp CV đã được tách sang modules/cv/cv.controller
