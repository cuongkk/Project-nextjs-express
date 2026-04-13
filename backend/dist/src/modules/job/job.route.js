"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobController = __importStar(require("./job.controller"));
const jobValidate = __importStar(require("./job.validate"));
const authMiddleware = __importStar(require("../../middlewares/auth.middleware"));
const cloudinary_helper_1 = require("../../utils/cloudinary.helper");
const router = (0, express_1.Router)();
// JOBS
router.get("/all", jobController.all);
router.get("/my", authMiddleware.verifyTokenCompany, jobController.list);
// ADDED: Recommend jobs for logged-in candidate
router.get("/recommend", authMiddleware.verifyTokenUser, jobController.recommend);
router.get("/", jobController.publicList);
router.get("/:id", jobController.detail);
router.post("/", authMiddleware.verifyTokenCompany, cloudinary_helper_1.upload.array("images", 8), async (req, res) => {
    try {
        const result = await (0, cloudinary_helper_1.uploadToCloudinary)(req.file.path);
        res.json({
            url: result.secure_url,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Upload failed" });
    }
}, jobValidate.createPost, jobController.create);
router.patch("/:id", authMiddleware.verifyTokenCompany, cloudinary_helper_1.upload.array("images", 8), async (req, res) => {
    try {
        const result = await (0, cloudinary_helper_1.uploadToCloudinary)(req.file.path);
        res.json({
            url: result.secure_url,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Upload failed" });
    }
}, jobValidate.editPatch, jobController.update);
router.delete("/:id", authMiddleware.verifyTokenCompany, jobController.remove);
exports.default = router;
