import { Request, Response } from "express";
import { AccountRequest } from "../../interfaces/request.interface";
import * as userService from "./user.service";
import { logger } from "../../utils/logger";

export const profilePatch = async (req: AccountRequest, res: Response) => {
  try {
    const result = await userService.profilePatch(req);
    res.json(result);
  } catch (error) {
    logger.error("User profile update failed", error);
    res.status(500).json({
      code: "error",
      message: "Cập nhật không thành công!",
    });
  }
};
