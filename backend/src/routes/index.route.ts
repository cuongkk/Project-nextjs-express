import { Router } from "express";
import userRoutes from "../modules/user/user.route";
import authRoutes from "../modules/auth/auth.route";
import companyRoutes from "../modules/company/company.route";
import cityRoutes from "../modules/city/city.route";
import uploadRoutes from "../modules/upload/upload.route";
import jobRoutes from "../modules/job/job.route";
import cvRoutes from "../modules/cv/cv.route";
import applicationRoutes from "../modules/application/application.route";
import searchRoutes from "../modules/search/search.route";
import notificationRoutes from "../modules/notificaion/notification.route"; // ADDED
import profileRoutes from "../modules/profile/profile.route";
import chatRoutes from "../modules/chat/chat.route";

const router = Router();

router.use("/users", userRoutes);

router.use("/auth", authRoutes);

router.use("/companies", companyRoutes);

router.use("/cities", cityRoutes);

router.use("/uploads", uploadRoutes);

router.use("/jobs", jobRoutes);

router.use("/cvs", cvRoutes);

router.use("/applications", applicationRoutes);

router.use("/search", searchRoutes);

router.use("/notifications", notificationRoutes); // ADDED

router.use("/profile", profileRoutes);

router.use("/", chatRoutes);

export default router;
