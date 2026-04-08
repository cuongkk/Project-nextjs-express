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
const authController = __importStar(require("./auth.controller"));
const authValidate = __importStar(require("./auth.validate"));
const authMiddleware = __importStar(require("../../middlewares/auth.middleware"));
const router = (0, express_1.Router)();
router.post("/register", authValidate.registerPost, authController.register);
router.post("/login", authValidate.loginPost, authController.login);
router.get("/me", authMiddleware.authenticate, authController.me);
router.post("/refresh-token", authValidate.refreshTokenPost, authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/forgot-password", authValidate.forgotPasswordPost, authController.forgotPassword);
router.post("/verify-email", authValidate.verifyEmailPost, authController.verifyEmail);
router.post("/reset-password", authValidate.resetPasswordPost, authController.resetPassword);
router.patch("/change-password", authMiddleware.verifyTokenUser, authValidate.changePasswordPatch, authController.changePassword);
exports.default = router;
