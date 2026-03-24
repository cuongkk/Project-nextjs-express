import { Request, Response } from "express";
import * as uploadService from "./upload.service";

export const imagePost = async (req: Request, res: Response) => {
  const result = await uploadService.uploadImage(req?.file?.path);
  res.json(result);
};
