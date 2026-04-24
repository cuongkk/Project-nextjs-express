import { Router } from "express";
import * as userController from "./user.controller";
import * as userValidate from "./user.validate";
import * as authMiddleware from "../../middlewares/auth.middleware";
import { upload } from "../../utils/cloudinary.helper";
import { uploadCloudinaryMiddleware } from "../../middlewares/upload-cloudinary.middleware";

const router = Router();

router.patch("/profile", authMiddleware.verifyTokenUser, upload.single("avatar"), uploadCloudinaryMiddleware, userValidate.profilePatch, userController.profilePatch);

export default router;
