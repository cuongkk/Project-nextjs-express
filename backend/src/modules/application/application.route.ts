import { Router } from "express";
import * as authMiddleware from "../../middlewares/auth.middleware";
import * as applicationValidate from "./application.validate";
import * as applicationController from "./application.controller";

import { upload } from "../../utils/cloudinary.helper";
import { uploadCloudinaryMiddleware } from "../../middlewares/upload-cloudinary.middleware";

const router = Router();

router.post("/", authMiddleware.verifyTokenUser, upload.single("fileCV"), uploadCloudinaryMiddleware, applicationValidate.applyPost, applicationController.apply);

router.get("/", authMiddleware.authenticate, applicationController.list);

router.get("/:id", authMiddleware.authenticate, applicationController.detail);

router.patch("/:id", authMiddleware.verifyTokenCompany, applicationValidate.companyChangeStatusPatch, applicationController.companyChangeStatus);

router.patch("/:id/interview-date", authMiddleware.verifyTokenCompany, applicationValidate.companySetInterviewDatePatch, applicationController.companySetInterviewDate);

// User xóa đơn ứng tuyển (chỉ khi bị từ chối)
router.delete("/:id", authMiddleware.verifyTokenUser, applicationController.removeByUser);

export default router;
