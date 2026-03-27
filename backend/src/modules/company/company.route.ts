import { Router } from "express";
import * as companyController from "./company.controller";
import * as companyValidate from "./company.validate";
import * as authMiddleware from "../../middlewares/auth.middleware";
import multer from "multer";
import { storage } from "../../utils/cloudinary.helper";

const router = Router();

const upload = multer({ storage: storage });

router.patch("/profile", authMiddleware.verifyTokenCompany, upload.single("logo"), companyValidate.profilePatch, companyController.profilePatch);

router.get("/", companyController.list);

router.get("/:id", companyController.detail);

export default router;
