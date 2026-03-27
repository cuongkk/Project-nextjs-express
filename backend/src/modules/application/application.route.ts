import { Router } from "express";
import * as authMiddleware from "../../middlewares/auth.middleware";
import * as applicationValidate from "./application.validate";
import * as applicationController from "./application.controller";
import multer from "multer";
import { storage } from "../../utils/cloudinary.helper";

const router = Router();

const upload = multer({ storage });

router.post("/", authMiddleware.verifyTokenUser, upload.single("fileCV"), applicationValidate.applyPost, applicationController.apply);

router.get("/", authMiddleware.authenticate, applicationController.list);

router.get("/:id", authMiddleware.authenticate, applicationController.detail);

router.patch("/:id", authMiddleware.verifyTokenCompany, applicationValidate.companyChangeStatusPatch, applicationController.companyChangeStatus);

export default router;
