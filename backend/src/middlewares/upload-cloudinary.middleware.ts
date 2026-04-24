import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import { uploadToCloudinary } from "../utils/cloudinary.helper";

const mapFileToCloudinary = async (file: Express.Multer.File) => {
  const result = await uploadToCloudinary(file.path);
  await fs.unlink(file.path).catch(() => undefined);

  return {
    ...file,
    path: result.secure_url,
    filename: result.public_id,
  } as Express.Multer.File;
};

export const uploadCloudinaryMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.file) {
      req.file = await mapFileToCloudinary(req.file);
      next();
      return;
    }

    if (Array.isArray(req.files)) {
      req.files = await Promise.all(req.files.map((file) => mapFileToCloudinary(file as Express.Multer.File)));
      next();
      return;
    }

    next();
  } catch {
    res.status(500).json({
      code: "error",
      message: "Upload failed",
    });
  }
};
