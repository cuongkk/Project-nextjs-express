import { Request, Response } from "express";
import { AccountRequest } from "../../interfaces/request.interface";
import * as userService from "./user.service";

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
