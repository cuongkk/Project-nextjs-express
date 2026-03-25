import { Request, Response } from "express";
import { AccountRequest } from "../../interfaces/request.interface";
import * as companyService from "./company.service";

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
