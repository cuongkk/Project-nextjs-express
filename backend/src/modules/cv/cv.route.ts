import { Router } from "express";
import multer from "multer";
import { upload, uploadToCloudinary } from "../../utils/cloudinary.helper";
import * as authMiddleware from "../../middlewares/auth.middleware";
import * as cvController from "./cv.controller";

const router = Router();

router.get("/", authMiddleware.verifyTokenUser, cvController.listUser);

router.get("/:id", authMiddleware.verifyTokenUser, cvController.detailUser);

router.post(
  "/",
  authMiddleware.verifyTokenUser,
  upload.single("fileCV"),
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
  cvController.create,
);

router.patch(
  "/:id",
  authMiddleware.verifyTokenUser,
  upload.single("fileCV"),
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
  cvController.update,
);

router.delete("/:id", authMiddleware.verifyTokenUser, cvController.remove);

export default router;
