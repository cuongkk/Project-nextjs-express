import { Router } from "express";
import * as userController from "./user.controller";
import * as userValidate from "./user.validate";
import multer from "multer";
import * as authMiddleware from "../../middlewares/auth.middleware";
import { upload, uploadToCloudinary } from "../../utils/cloudinary.helper";

const router = Router();

router.patch(
  "/profile",
  authMiddleware.verifyTokenUser,
  upload.single("avatar"),
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
  userValidate.profilePatch,
  userController.profilePatch,
);

export default router;
