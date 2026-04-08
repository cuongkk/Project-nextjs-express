import { Router } from "express";
import * as companyController from "./company.controller";
import * as companyValidate from "./company.validate";
import * as authMiddleware from "../../middlewares/auth.middleware";
import { upload, uploadToCloudinary } from "../../utils/cloudinary.helper";

const router = Router();

router.patch(
  "/profile",
  authMiddleware.verifyTokenCompany,
  upload.single("logo"),
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
  companyValidate.profilePatch,
  companyController.profilePatch,
);

router.get("/", companyController.list);

router.get("/:id", companyController.detail);

export default router;
