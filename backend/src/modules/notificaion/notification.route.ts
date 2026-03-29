// ADDED: Notification routes
import { Router } from "express";
import * as authMiddleware from "../../middlewares/auth.middleware";
import * as notificationController from "./notification.controller";

const router = Router();

router.get("/", authMiddleware.authenticate, notificationController.list); // GET /notifications
router.get("/count", authMiddleware.authenticate, notificationController.count); // GET /notifications/count
router.patch("/read-all", authMiddleware.authenticate, notificationController.readAll); // PATCH /notifications/read-all

export default router;
