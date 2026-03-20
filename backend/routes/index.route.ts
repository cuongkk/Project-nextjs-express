import { Router } from "express";
import userRoutes from "./user.route";
import authRoutes from "./auth.route";
import companyRoutes from "./company.route";
import cityRoutes from "./city.route";
import uploadRoutes from "./upload.route";
import searchRoutes from "./search.route";

const router = Router();

router.use("/user", userRoutes);

router.use("/auth", authRoutes);

router.use("/company", companyRoutes);

router.use("/city", cityRoutes);

router.use("/search", searchRoutes);

router.use("/upload", uploadRoutes);

export default router;
