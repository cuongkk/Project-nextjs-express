import { Router } from "express";
import userRoutes from "../modules/user/user.route";
import authRoutes from "../modules/auth/auth.route";
import companyRoutes from "../modules/company/company.route";
import cityRoutes from "../modules/city/city.route";
import uploadRoutes from "../modules/upload/upload.route";
import searchRoutes from "../modules/search/search.route";
import jobRoutes from "../modules/job/job.route";
import cvRoutes from "../modules/cv/cv.route";
import applicationRoutes from "../modules/application/application.route";

const router = Router();

router.use("/user", userRoutes);

router.use("/auth", authRoutes);

router.use("/company", companyRoutes);

router.use("/city", cityRoutes);

router.use("/search", searchRoutes);

router.use("/upload", uploadRoutes);

router.use("/job", jobRoutes);

router.use("/cv", cvRoutes);

router.use("/application", applicationRoutes);

export default router;
