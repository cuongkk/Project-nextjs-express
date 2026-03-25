import { Router } from "express";
import * as jobController from "./job.controller";
import * as jobValidate from "../../validates/job.validate";
import * as authMiddleware from "../../middlewares/auth.middleware";
import multer from "multer";
import { storage } from "../../utils/cloudinary.helper";

const router = Router();

const upload = multer({ storage: storage });

// JOBS
router.get("/", jobController.list);

router.get("/:id", jobController.detail);

router.post("/", authMiddleware.verifyTokenCompany, upload.array("images", 8), jobValidate.createPost, jobController.create);

router.patch("/:id", authMiddleware.verifyTokenCompany, upload.array("images", 8), jobValidate.editPatch, jobController.update);

router.delete("/:id", authMiddleware.verifyTokenCompany, jobController.remove);

export default router;
