import { Request, Response } from "express";
import { AccountRequest } from "../../interfaces/request.interface";
import * as cvService from "./cv.service";

export const userList = async (req: AccountRequest, res: Response) => {
  const result = await cvService.userList(req);
  res.json(result);
};

export const companyList = async (req: AccountRequest, res: Response) => {
  const result = await cvService.companyList(req);
  res.json(result);
};

export const companyDetail = async (req: AccountRequest, res: Response) => {
  try {
    const result = await cvService.companyDetail(req);
    res.json(result);
  } catch (error) {
    res.json({
      code: "error",
      message: "Thất bại!",
    });
  }
};

export const companyChangeStatus = async (req: AccountRequest, res: Response) => {
  try {
    const result = await cvService.companyChangeStatus(req);
    res.json(result);
  } catch (error) {
    res.json({
      code: "error",
      message: "Thất bại!",
    });
  }
};

export const companyDelete = async (req: AccountRequest, res: Response) => {
  try {
    const result = await cvService.companyDelete(req);
    res.json(result);
  } catch (error) {
    res.json({
      code: "error",
      message: "Thất bại!",
    });
  }
};

export const apply = async (req: Request & { file?: any }, res: Response) => {
  try {
    const result = await cvService.apply(req);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Gửi CV không thành công. Vui lòng gửi lai!",
    });
  }
};
