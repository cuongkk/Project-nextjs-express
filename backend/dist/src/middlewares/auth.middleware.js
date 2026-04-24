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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenCompany = exports.verifyTokenUser = exports.authenticate = void 0;
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const company_model_1 = __importDefault(require("../modules/company/company.model"));
const token_util_1 = require("../utils/token.util");
const authService = __importStar(require("../modules/auth/auth.service"));
const logger_1 = require("../utils/logger");
const getTokenFromRequest = (req) => {
    const authHeader = req.headers["authorization"];
    if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        return authHeader.substring(7);
    }
    if (req.cookies?.accessToken) {
        return req.cookies.accessToken;
    }
    return null;
};
const authenticate = async (req, res, next) => {
    try {
        let token = getTokenFromRequest(req);
        if (!token) {
            const refreshResult = await authService.refreshToken(req);
            if (!refreshResult || refreshResult.code !== "success" || !refreshResult.tokens) {
                res.status(401).json({
                    code: "error",
                    message: "Vui lòng đăng nhập!",
                });
                return;
            }
            const { accessToken, refreshToken } = refreshResult.tokens;
            const isProduction = process.env.NODE_ENV === "production";
            const cookieOptions = {
                httpOnly: true,
                sameSite: isProduction ? "none" : "lax",
                secure: isProduction,
            };
            res.cookie("accessToken", accessToken, {
                maxAge: 15 * 60 * 1000,
                ...cookieOptions,
            });
            const refreshCookieOptions = {
                ...cookieOptions,
            };
            res.cookie("refreshToken", refreshToken, refreshCookieOptions);
            token = accessToken;
        }
        const decoded = (0, token_util_1.verifyAccessToken)(token);
        req.user = decoded;
        if (decoded.role === "user") {
            const account = await user_model_1.default.findById(decoded.id);
            if (!account) {
                res.status(401).json({ code: "error", message: "Token không hợp lệ!" });
                return;
            }
            req.account = account;
        }
        else if (decoded.role === "company") {
            const account = await company_model_1.default.findById(decoded.id);
            if (!account) {
                res.status(401).json({ code: "error", message: "Token không hợp lệ!" });
                return;
            }
            req.account = account;
        }
        next();
    }
    catch (error) {
        logger_1.logger.warn("Authenticate middleware failed", {
            requestId: res.locals.requestId,
        });
        res.status(401).json({
            code: "error",
            message: "Token không hợp lệ!",
        });
    }
};
exports.authenticate = authenticate;
const verifyTokenUser = async (req, res, next) => {
    await (0, exports.authenticate)(req, res, (err) => {
        if (err)
            return;
        if (req.user?.role !== "user") {
            res.status(403).json({ code: "error", message: "Không có quyền truy cập!" });
            return;
        }
        next();
    });
};
exports.verifyTokenUser = verifyTokenUser;
const verifyTokenCompany = async (req, res, next) => {
    await (0, exports.authenticate)(req, res, (err) => {
        if (err)
            return;
        if (req.user?.role !== "company") {
            return res.status(403).json({
                code: "error",
                message: "Không có quyền truy cập!",
            });
        }
        next();
    });
};
exports.verifyTokenCompany = verifyTokenCompany;
