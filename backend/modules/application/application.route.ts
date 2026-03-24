import { Router } from "express";
import * as authMiddleware from "../../middlewares/auth.middleware";
import * as applicationController from "./application.controller";

const router = Router();

// USER: quản lý đơn ứng tuyển của chính mình
router.get("/user/list", authMiddleware.verifyTokenUser, applicationController.userList);
router.get("/user/detail/:id", authMiddleware.verifyTokenUser, applicationController.userDetail);

// COMPANY: quản lý đơn ứng tuyển cho job của công ty
router.get("/company/list", authMiddleware.verifyTokenCompany, applicationController.companyList);
router.get("/company/detail/:id", authMiddleware.verifyTokenCompany, applicationController.companyDetail);
router.patch("/company/change-status", authMiddleware.verifyTokenCompany, applicationController.companyChangeStatus);

export default router;
