import { Router } from "express";
import * as uploadController from "./upload.controller";
import multer from "multer";
import { storage } from "../../utils/cloudinary.helper";

const router = Router();

const upload = multer({ storage: storage });

// UPLOADS
// Generic upload endpoint, type can be specified in body (e.g., { type: "image" })
router.post("/", upload.single("file"), uploadController.imagePost);

// Backward-compatible alias
router.post("/images", upload.single("file"), uploadController.imagePost);

export default router;
