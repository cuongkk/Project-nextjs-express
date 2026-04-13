import { Router } from "express";
import * as jobController from "./job.controller";
import * as jobValidate from "./job.validate";
import * as authMiddleware from "../../middlewares/auth.middleware";
import { upload, uploadToCloudinary } from "../../utils/cloudinary.helper";

const router = Router();

// JOBS
router.get("/all", jobController.all);

router.get("/my", authMiddleware.verifyTokenCompany, jobController.list);

// ADDED: Recommend jobs for logged-in candidate
router.get("/recommend", authMiddleware.verifyTokenUser, jobController.recommend);

router.get("/", jobController.publicList);

router.get("/:id", jobController.detail);

router.post(
  "/",
  authMiddleware.verifyTokenCompany,
  upload.array("images", 8),
  async (req, res) => {
    try {
      const result = await uploadToCloudinary(req.file!.path);

      res.json({
        url: result.secure_url,
      });
    } catch (err) {
      res.status(500).json({ message: "Upload failed" });
    }
  },
  jobValidate.createPost,
  jobController.create,
);

router.patch(
  "/:id",
  authMiddleware.verifyTokenCompany,
  upload.array("images", 8),
  async (req, res) => {
    try {
      const result = await uploadToCloudinary(req.file!.path);

      res.json({
        url: result.secure_url,
      });
    } catch (err) {
      res.status(500).json({ message: "Upload failed" });
    }
  },
  jobValidate.editPatch,
  jobController.update,
);

router.delete("/:id", authMiddleware.verifyTokenCompany, jobController.remove);

export default router;
