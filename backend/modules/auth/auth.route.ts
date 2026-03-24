import { Router } from "express";
import * as authController from "./auth.controller";

const router = Router();

router.get("/check", authController.check);

router.get("/company-check", authController.authCompanyCheck);

router.get("/logout", authController.logout);

export default router;
