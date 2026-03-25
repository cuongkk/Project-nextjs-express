import { Router } from "express";
import multer from "multer";
import { storage } from "../../utils/cloudinary.helper";
import * as authMiddleware from "../../middlewares/auth.middleware";
import * as cvController from "./cv.controller";

const router = Router();
const upload = multer({ storage: storage });

// CVS (resume resource) - basic CRUD for user CVs
router.get("/", authMiddleware.verifyTokenUser, cvController.listUser);

router.get("/:id", authMiddleware.verifyTokenUser, cvController.detailUser);

router.post("/", authMiddleware.verifyTokenUser, upload.single("fileCV"), cvController.create);

router.patch("/:id", authMiddleware.verifyTokenUser, upload.single("fileCV"), cvController.update);

router.delete("/:id", authMiddleware.verifyTokenUser, cvController.remove);

export default router;
