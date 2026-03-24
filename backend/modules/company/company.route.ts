import { Router } from "express";
import * as companyController from "./company.controller";
import * as companyValidate from "../../validates/company.validate";
import * as authMiddleware from "../../middlewares/auth.middleware";
import multer from "multer";
import { storage } from "../../utils/cloudinary.helper";

const router = Router();

const upload = multer({ storage: storage });

router.post("/register", companyValidate.registerPost, companyController.registerPost);

router.post("/login", companyValidate.loginPost, companyController.loginPost);

router.post("/forgot-password", companyValidate.forgotPasswordPost, companyController.forgotPasswordPost);

router.post("/reset-password", companyValidate.resetPasswordPost, companyController.resetPasswordPost);

router.patch("/profile", authMiddleware.verifyTokenCompany, upload.single("logo"), companyController.profilePatch);

router.post("/job/create", authMiddleware.verifyTokenCompany, upload.array("images", 8), companyController.createJobPost);

router.get("/job/list", authMiddleware.verifyTokenCompany, companyController.listJob);

router.get("/job/edit/:id", authMiddleware.verifyTokenCompany, companyController.editJob);

router.patch("/job/edit/:id", authMiddleware.verifyTokenCompany, upload.array("images", 8), companyController.editJobPatch);

router.delete("/job/delete/:id", authMiddleware.verifyTokenCompany, companyController.deleteJobDel);

router.get("/list", companyController.list);

router.get("/detail/:id", companyController.detail);

// Các route CV đã chuyển sang /cv/... trong modules/cv/cv.route

export default router;
