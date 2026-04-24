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
exports.me = exports.changePassword = exports.logout = exports.resetPassword = exports.verifyEmail = exports.forgotPassword = exports.refreshToken = exports.login = exports.register = void 0;
const authService = __importStar(require("./auth.service"));
const logger_1 = require("../../utils/logger");
const buildAuthCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
    };
};
const register = async (req, res) => {
    try {
        const result = await authService.register(req);
        res.json(result);
    }
    catch (error) {
        logger_1.logger.error("Register failed", error);
        res.status(500).json({
            code: "error",
            message: "Đăng ký không thành công!",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const result = await authService.login(req);
        if (result.tokens) {
            const { accessToken, refreshToken, isRemember } = result.tokens;
            const baseCookieOptions = buildAuthCookieOptions();
            res.cookie("accessToken", accessToken, {
                maxAge: 15 * 60 * 1000,
                ...baseCookieOptions,
            });
            const refreshCookieOptions = {
                ...baseCookieOptions,
            };
            if (isRemember) {
                refreshCookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000;
            }
            res.cookie("refreshToken", refreshToken, refreshCookieOptions);
        }
        const role = result.role;
        const info = result.info;
        let infoUser = null;
        let infoCompany = null;
        if (role === "user") {
            infoUser = info ?? null;
        }
        else if (role === "company") {
            infoCompany = info ?? null;
        }
        res.json({
            code: result.code,
            message: result.message,
            role,
            infoUser,
            infoCompany,
        });
    }
    catch (error) {
        logger_1.logger.error("Login failed", error);
        res.status(500).json({
            code: "error",
            message: "Đăng nhập không thành công!",
        });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    try {
        const result = await authService.refreshToken(req);
        if (result.tokens) {
            const { accessToken, refreshToken } = result.tokens;
            const baseCookieOptions = buildAuthCookieOptions();
            res.cookie("accessToken", accessToken, {
                maxAge: 15 * 60 * 1000,
                ...baseCookieOptions,
            });
            const refreshCookieOptions = {
                ...baseCookieOptions,
            };
            res.cookie("refreshToken", refreshToken, refreshCookieOptions);
        }
        res.json(result);
    }
    catch (error) {
        logger_1.logger.error("Refresh token failed", error);
        res.status(500).json({
            code: "error",
            message: "Làm mới token không thành công!",
        });
    }
};
exports.refreshToken = refreshToken;
const forgotPassword = async (req, res) => {
    try {
        const result = await authService.forgotPassword(req);
        res.json(result);
    }
    catch (error) {
        logger_1.logger.error("Forgot password failed", error);
        res.status(500).json({
            code: "error",
            message: "Gửi OTP không thành công!",
        });
    }
};
exports.forgotPassword = forgotPassword;
const verifyEmail = async (req, res) => {
    try {
        const result = await authService.verifyEmail(req);
        res.json(result);
    }
    catch (error) {
        logger_1.logger.error("Verify email failed", error);
        res.status(500).json({
            code: "error",
            message: "Xác thực email không thành công!",
        });
    }
};
exports.verifyEmail = verifyEmail;
const resetPassword = async (req, res) => {
    try {
        const result = await authService.resetPassword(req);
        res.json(result);
    }
    catch (error) {
        logger_1.logger.error("Reset password failed", error);
        res.status(500).json({
            code: "error",
            message: "Đặt lại mật khẩu không thành công!",
        });
    }
};
exports.resetPassword = resetPassword;
const logout = async (req, res) => {
    try {
        const result = await authService.logout(req);
        const cookieOptions = buildAuthCookieOptions();
        res.clearCookie("accessToken", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);
        res.json(result);
    }
    catch (error) {
        logger_1.logger.error("Logout failed", error);
        const cookieOptions = buildAuthCookieOptions();
        res.clearCookie("accessToken", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);
        res.status(500).json({
            code: "error",
            message: "Đăng xuất không thành công!",
        });
    }
};
exports.logout = logout;
const changePassword = async (req, res) => {
    try {
        const result = await authService.changePasswordPatch(req);
        res.json(result);
    }
    catch (error) {
        logger_1.logger.error("Change password failed", error);
        res.status(500).json({
            code: "error",
            message: "Đổi mật khẩu không thành công!",
        });
    }
};
exports.changePassword = changePassword;
const me = async (req, res) => {
    try {
        const userPayload = req.user;
        const account = req.account;
        const result = await authService.me(userPayload, account);
        return res.status(result.status).json(result.data);
    }
    catch (error) {
        logger_1.logger.error("Get current user failed", error);
        return res.status(500).json({
            code: "error",
            message: "Lấy thông tin đăng nhập không thành công!",
        });
    }
};
exports.me = me;
