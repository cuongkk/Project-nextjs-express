import { Router } from "express";
import * as authMiddleware from "../../middlewares/auth.middleware";
import * as profileController from "./profile.controller";
import * as profileValidate from "./profile.validate";
import { upload } from "../../utils/cloudinary.helper";

const router = Router();

router.get("/me", authMiddleware.verifyTokenUser, profileController.me);

router.patch("/me", authMiddleware.verifyTokenUser, profileValidate.patchMe, profileController.patchMe);

router.post("/me/cv", authMiddleware.verifyTokenUser, upload.single("resume"), profileController.uploadResume);

export default router;
