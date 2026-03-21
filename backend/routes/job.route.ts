import { Router } from "express";
import * as jobController from "../controllers/job.controller";
import multer from "multer";
import { storage } from "../helpers/cloudinary.helper";

const router = Router();

const upload = multer({ storage: storage });

router.get("/detail/:id", jobController.detail);

router.post("/apply", upload.single("fileCV"), jobController.applyPost);

export default router;
