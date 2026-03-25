import { Router } from "express";
import * as authMiddleware from "../../middlewares/auth.middleware";
import * as applicationValidate from "../../validates/application.validate";
import * as applicationController from "./application.controller";

const router = Router();

// APPLICATIONS
// Apply to a job (user only)
router.post("/", authMiddleware.verifyTokenUser, applicationValidate.applyPost, applicationController.apply);

// List applications depending on role (user/company)
router.get("/", authMiddleware.authenticate, applicationController.list);

// Application detail for current user/company
router.get("/:id", authMiddleware.authenticate, applicationController.detail);

// Company change status for an application
router.patch("/:id", authMiddleware.verifyTokenCompany, applicationValidate.companyChangeStatusPatch, applicationController.companyChangeStatus);

export default router;
