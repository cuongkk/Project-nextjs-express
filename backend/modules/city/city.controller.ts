import { Request, Response } from "express";
import * as cityService from "./city.service";

export const list = async (req: Request, res: Response) => {
  const result = await cityService.list();

  res.json({
    code: "success",
    message: "Thành công!",
    ...result,
  });
};
