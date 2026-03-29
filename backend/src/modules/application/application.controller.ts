import { Request, Response } from "express";
import { AccountRequest } from "../../interfaces/request.interface";
import * as applicationService from "./application.service";

export const apply = async (req: AccountRequest, res: Response) => {
  try {
    const result = await applicationService.apply(req as any);
    res.json(result);
  } catch (error) {
    res.json({ code: "error", message: "Gửi đơn ứng tuyển thất bại!" });
  }
};

export const list = async (req: AccountRequest, res: Response) => {
  const role = (req as any).user?.role;

  if (role === "user") {
    // FIXED: user only sees their own applications (service filters by userId)
    const result = await applicationService.userList(req);
    res.json(result);
    return;
  }

  if (role === "company") {
    // FIXED: company only sees applications for its own jobs (service filters by companyId)
    const result = await applicationService.companyList(req);
    res.json(result);
    return;
  }

  res.status(403).json({ code: "error", message: "Không có quyền truy cập!" });
};

export const detail = async (req: AccountRequest, res: Response) => {
  const role = (req as any).user?.role;

  try {
    if (role === "user") {
      // FIXED: user can only view their own application (service enforces userId)
      const result = await applicationService.userDetail(req);
      res.json(result);
      return;
    }

    if (role === "company") {
      // FIXED: company can only view applications that belong to its jobs (service enforces companyId)
      const result = await applicationService.companyDetail(req);
      res.json(result);
      return;
    }

    res.status(403).json({ code: "error", message: "Không có quyền truy cập!" });
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
