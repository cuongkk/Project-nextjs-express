import { Router } from "express";
import * as userController from "./user.controller";
import * as userValidate from "../../validates/user.validate";
import multer from "multer";
import { storage } from "../../utils/cloudinary.helper";
import * as authMiddleware from "../../middlewares/auth.middleware";

const router = Router();

const upload = multer({ storage: storage });

// USERS
router.patch("/profile", authMiddleware.verifyTokenUser, upload.single("avatar"), userValidate.profilePatch, userController.profilePatch);

export default router;
