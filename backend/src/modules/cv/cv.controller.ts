import { Request, Response } from "express";
import { AccountRequest } from "../../interfaces/request.interface";
import * as cvService from "./cv.service";

export const listUser = async (req: AccountRequest, res: Response) => {
  try {
    const result = await cvService.listForUser(req);
    res.json(result);
  } catch (error) {
    res.json({ code: "error", message: "Thất bại!" });
  }
};

export const detailUser = async (req: AccountRequest, res: Response) => {
  try {
    const result = await cvService.detailForUser(req);
    res.json(result);
  } catch (error) {
    res.json({ code: "error", message: "Thất bại!" });
  }
};

export const create = async (req: Request & { file?: any }, res: Response) => {
  try {
    const result = await cvService.create(req as any);
    res.json(result);
  } catch (error) {
    res.json({ code: "error", message: "Tạo CV thất bại!" });
  }
};

export const update = async (req: Request & { file?: any }, res: Response) => {
  try {
    const result = await cvService.update(req as any);
    res.json(result);
  } catch (error) {
    res.json({ code: "error", message: "Cập nhật CV thất bại!" });
  }
};

export const remove = async (req: AccountRequest, res: Response) => {
  try {
    const result = await cvService.remove(req);
    res.json(result);
  } catch (error) {
    res.json({ code: "error", message: "Xóa CV thất bại!" });
  }
};
