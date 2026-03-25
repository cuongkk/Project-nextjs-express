import { Router } from "express";
import * as authController from "./auth.controller";
import * as authValidate from "./auth.validate";
import * as authMiddleware from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", authValidate.registerPost, authController.register);

router.post("/login", authValidate.loginPost, authController.login);

router.get("/me", authMiddleware.authenticate, authController.me);

router.post("/refresh-token", authValidate.refreshTokenPost, authController.refreshToken);

router.post("/logout", authController.logout);

router.post("/forgot-password", authValidate.forgotPasswordPost, authController.forgotPassword);

router.post("/reset-password", authValidate.resetPasswordPost, authController.resetPassword);

router.patch("/change-password", authMiddleware.verifyTokenUser, authValidate.changePasswordPatch, authController.changePassword);

export default router;
