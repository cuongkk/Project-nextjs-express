import { Request, Response } from "express";
import { AccountRequest } from "../../interfaces/request.interface";
import * as applicationService from "./application.service";

export const userList = async (req: AccountRequest, res: Response) => {
  const result = await applicationService.userList(req);
  res.json(result);
};

export const userDetail = async (req: AccountRequest, res: Response) => {
  try {
    const result = await applicationService.userDetail(req);
    res.json(result);
  } catch (error) {
    res.json({ code: "error", message: "Thất bại!" });
  }
};

export const companyList = async (req: AccountRequest, res: Response) => {
  const result = await applicationService.companyList(req);
  res.json(result);
};

export const companyDetail = async (req: AccountRequest, res: Response) => {
  try {
    const result = await applicationService.companyDetail(req);
    res.json(result);
  } catch (error) {
    res.json({ code: "error", message: "Thất bại!" });
  }
};

export const companyChangeStatus = async (req: AccountRequest, res: Response) => {
  try {
    const result = await applicationService.companyChangeStatus(req);
    res.json(result);
  } catch (error) {
    res.json({ code: "error", message: "Thất bại!" });
  }
};
