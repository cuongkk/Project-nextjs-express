import { Router } from "express";
import * as companyController from "./company.controller";
import * as companyValidate from "./company.validate";
import * as authMiddleware from "../../middlewares/auth.middleware";
import { upload } from "../../utils/cloudinary.helper";
import { uploadCloudinaryMiddleware } from "../../middlewares/upload-cloudinary.middleware";

const router = Router();

router.patch("/profile", authMiddleware.verifyTokenCompany, upload.single("logo"), uploadCloudinaryMiddleware, companyValidate.profilePatch, companyController.profilePatch);

router.get("/", companyController.list);

router.get("/:id", companyController.detail);

export default router;
