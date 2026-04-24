import { Router } from "express";
import * as uploadController from "./upload.controller";
import { upload } from "../../utils/cloudinary.helper";
import { uploadCloudinaryMiddleware } from "../../middlewares/upload-cloudinary.middleware";

const router = Router();

router.post("/", upload.single("file"), uploadCloudinaryMiddleware, uploadController.imagePost);

router.post("/images", upload.single("file"), uploadCloudinaryMiddleware, uploadController.imagePost);

export default router;
