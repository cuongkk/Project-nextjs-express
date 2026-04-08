import { Router } from "express";
import * as uploadController from "./upload.controller";
import multer from "multer";
import { upload, uploadToCloudinary } from "../../utils/cloudinary.helper";

const router = Router();

router.post(
  "/",
  upload.single("file"),
  async (req, res) => {
    try {
      const result = await uploadToCloudinary(req.file!.path);

      res.json({
        url: result.secure_url,
      });
    } catch (err) {
      res.status(500).json({ message: "Upload failed" });
    }
  },
  uploadController.imagePost,
);

router.post(
  "/images",
  upload.single("file"),
  async (req, res) => {
    try {
      const result = await uploadToCloudinary(req.file!.path);

      res.json({
        url: result.secure_url,
      });
    } catch (err) {
      res.status(500).json({ message: "Upload failed" });
    }
  },
  uploadController.imagePost,
);

export default router;
