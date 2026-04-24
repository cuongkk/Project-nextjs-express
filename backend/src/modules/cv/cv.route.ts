import { Router } from "express";
import { upload } from "../../utils/cloudinary.helper";
import * as authMiddleware from "../../middlewares/auth.middleware";
import * as cvController from "./cv.controller";
import { uploadCloudinaryMiddleware } from "../../middlewares/upload-cloudinary.middleware";

const router = Router();

router.get("/", authMiddleware.verifyTokenUser, cvController.listUser);

router.get("/:id", authMiddleware.verifyTokenUser, cvController.detailUser);

router.post("/", authMiddleware.verifyTokenUser, upload.single("fileCV"), uploadCloudinaryMiddleware, cvController.create);

router.patch("/:id", authMiddleware.verifyTokenUser, upload.single("fileCV"), uploadCloudinaryMiddleware, cvController.update);

router.delete("/:id", authMiddleware.verifyTokenUser, cvController.remove);

export default router;
