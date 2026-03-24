import { Router } from "express";
import multer from "multer";
import { storage } from "../../utils/cloudinary.helper";
import * as authMiddleware from "../../middlewares/auth.middleware";
import * as cvController from "./cv.controller";

const router = Router();
const upload = multer({ storage: storage });

// USER: lấy danh sách CV của user hiện tại
router.get("/user/list", authMiddleware.verifyTokenUser, cvController.userList);

// COMPANY: quản lý CV ứng tuyển vào job của công ty
router.get("/company/list", authMiddleware.verifyTokenCompany, cvController.companyList);
router.get("/company/detail/:id", authMiddleware.verifyTokenCompany, cvController.companyDetail);
router.patch("/company/change-status", authMiddleware.verifyTokenCompany, cvController.companyChangeStatus);
router.delete("/company/delete/:id", authMiddleware.verifyTokenCompany, cvController.companyDelete);
router.post("/apply", authMiddleware.verifyTokenUser, upload.single("fileCV"), cvController.apply);

export default router;
