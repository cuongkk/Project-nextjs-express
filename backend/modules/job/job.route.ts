import { Router } from "express";
import * as jobController from "./job.controller";
import multer from "multer";
import { storage } from "../../utils/cloudinary.helper";

const router = Router();

const upload = multer({ storage: storage });

router.get("/detail/:id", jobController.detail);

export default router;
