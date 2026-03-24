import { Router } from "express";
import * as uploadController from "./upload.controller";
import multer from "multer";
import { storage } from "../../utils/cloudinary.helper";

const router = Router();

const upload = multer({ storage: storage });

router.post("/image", upload.single("file"), uploadController.imagePost);

export default router;
