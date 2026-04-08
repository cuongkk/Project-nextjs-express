"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordPatch = exports.resetPasswordPost = exports.verifyEmailPost = exports.forgotPasswordPost = exports.refreshTokenPost = exports.loginPost = exports.registerPost = void 0;
const joi_1 = __importDefault(require("joi"));
const passwordSchema = joi_1.default.string()
    .min(8)
    .custom((value, helpers) => {
    if (!/[a-z]/.test(value)) {
        return helpers.error("password.lowercase");
    }
    if (!/[A-Z]/.test(value)) {
        return helpers.error("password.uppercase");
    }
    if (!/\d/.test(value)) {
        return helpers.error("password.number");
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
        return helpers.error("password.special");
    }
    return value;
})
    .messages({
    "string.empty": "Vui lòng nhập mật khẩu!",
    "string.min": "Mật khẩu phải có ít nhất 8 ký tự!",
    "password.lowercase": "Mật khẩu phải chứa ký tự thường!",
    "password.uppercase": "Mật khẩu phải chứa ký tự hoa!",
    "password.number": "Mật khẩu phải chứa chữ số!",
    "password.special": "Mật khẩu phải chứa ký tự đặc biệt!",
});
const registerPost = async (req, res, next) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required().messages({
            "string.empty": "Vui lòng nhập email!",
            "string.email": "Email không đúng định dạng!",
        }),
        password: passwordSchema.required(),
        role: joi_1.default.string().valid("user", "company", "admin").required().messages({
            "any.only": "Role không hợp lệ!",
            "string.empty": "Vui lòng chọn loại tài khoản!",
        }),
    }).unknown(true);
    const { error } = schema.validate(req.body);
    if (error) {
        const errorMessage = error.details[0].message;
        res.json({
            code: "error",
            message: errorMessage,
        });
        return;
    }
    next();
};
exports.registerPost = registerPost;
const loginPost = async (req, res, next) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required().messages({
            "string.empty": "Vui lòng nhập email!",
            "string.email": "Email không đúng định dạng!",
        }),
        password: joi_1.default.string().required().messages({
            "string.empty": "Vui lòng nhập mật khẩu!",
        }),
        rememberMe: joi_1.default.alternatives().try(joi_1.default.boolean(), joi_1.default.string()).optional(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        const errorMessage = error.details[0].message;
        res.json({
            code: "error",
            message: errorMessage,
        });
        return;
    }
    next();
};
exports.loginPost = loginPost;
const refreshTokenPost = async (req, res, next) => {
    const schema = joi_1.default.object({
        refreshToken: joi_1.default.string().optional(),
    }).unknown(true);
    const { error } = schema.validate(req.body);
    if (error) {
        const errorMessage = error.details[0].message;
        res.json({
            code: "error",
            message: errorMessage,
        });
        return;
    }
    next();
};
exports.refreshTokenPost = refreshTokenPost;
const forgotPasswordPost = async (req, res, next) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required().messages({
            "string.empty": "Vui lòng nhập email!",
            "string.email": "Email không đúng định dạng!",
        }),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        const errorMessage = error.details[0].message;
        res.json({
            code: "error",
            message: errorMessage,
        });
        return;
    }
    next();
};
exports.forgotPasswordPost = forgotPasswordPost;
const verifyEmailPost = async (req, res, next) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required().messages({
            "string.empty": "Vui lòng nhập email!",
            "string.email": "Email không đúng định dạng!",
        }),
        otp: joi_1.default.string().length(6).required().messages({
            "string.empty": "Vui lòng nhập mã OTP!",
            "string.length": "Mã OTP phải gồm 6 ký tự!",
        }),
    }).unknown(true);
    const { error } = schema.validate(req.body);
    if (error) {
        const errorMessage = error.details[0].message;
        res.json({
            code: "error",
            message: errorMessage,
        });
        return;
    }
    next();
};
exports.verifyEmailPost = verifyEmailPost;
const resetPasswordPost = async (req, res, next) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required().messages({
            "string.empty": "Vui lòng nhập email!",
            "string.email": "Email không đúng định dạng!",
        }),
        newPassword: passwordSchema.required().messages({
            "string.empty": "Vui lòng nhập mật khẩu mới!",
        }),
    }).unknown(true);
    const { error } = schema.validate(req.body);
    if (error) {
        const errorMessage = error.details[0].message;
        res.json({
            code: "error",
            message: errorMessage,
        });
        return;
    }
    next();
};
exports.resetPasswordPost = resetPasswordPost;
const changePasswordPatch = async (req, res, next) => {
    const schema = joi_1.default.object({
        currentPassword: joi_1.default.string().required().messages({
            "string.empty": "Vui lòng nhập mật khẩu hiện tại!",
        }),
        newPassword: passwordSchema.required().messages({
            "string.empty": "Vui lòng nhập mật khẩu mới!",
        }),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        const errorMessage = error.details[0].message;
        res.json({
            code: "error",
            message: errorMessage,
        });
        return;
    }
    next();
};
exports.changePasswordPatch = changePasswordPatch;
