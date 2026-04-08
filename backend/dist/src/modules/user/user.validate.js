"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordPatch = exports.profilePatch = exports.resetPasswordPost = exports.forgotPasswordPost = exports.loginPost = exports.registerPost = void 0;
const joi_1 = __importDefault(require("joi"));
const registerPost = async (req, res, next) => {
    const schema = joi_1.default.object({
        fullName: joi_1.default.string().min(5).max(50).required().messages({
            "string.empty": "Vui lòng nhập họ tên!",
            "string.min": "Vui lòng nhập ít nhất 5 ký tự!",
            "string.max": "Vui lòng nhập tối đa 50 ký tự!",
        }),
        email: joi_1.default.string().email().required().messages({
            "string.empty": "Vui lòng nhập email!",
            "string.email": "Email không đúng định dạng!",
        }),
        password: joi_1.default.string()
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
            .required()
            .messages({
            "string.empty": "Vui lòng nhập mật khẩu!",
            "string.min": "Mật khẩu phải có ít nhất 8 ký tự!",
            "password.lowercase": "Mật khẩu phải chứa ký tự thường!",
            "password.uppercase": "Mật khẩu phải chứa ký tự hoa!",
            "password.number": "Mật khẩu phải chứa chữ số!",
            "password.special": "Mật khẩu phải chứa ký tự đặc biệt!",
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
exports.registerPost = registerPost;
const loginPost = async (req, res, next) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required().messages({
            "string.empty": "Vui lòng nhập email!",
            "string.email": "Email không đúng định dạng!",
        }),
        password: joi_1.default.string()
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
            .required()
            .messages({
            "string.empty": "Vui lòng nhập mật khẩu!",
            "string.min": "Mật khẩu phải có ít nhất 8 ký tự!",
            "password.lowercase": "Mật khẩu phải chứa ký tự thường!",
            "password.uppercase": "Mật khẩu phải chứa ký tự hoa!",
            "password.number": "Mật khẩu phải chứa chữ số!",
            "password.special": "Mật khẩu phải chứa ký tự đặc biệt!",
        }),
        check: joi_1.default.alternatives().try(joi_1.default.boolean(), joi_1.default.string()).optional(),
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
const resetPasswordPost = async (req, res, next) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required().messages({
            "string.empty": "Vui lòng nhập email!",
            "string.email": "Email không đúng định dạng!",
        }),
        otp: joi_1.default.string().length(6).required().messages({
            "string.empty": "Vui lòng nhập mã OTP!",
            "string.length": "Mã OTP phải gồm 6 ký tự!",
        }),
        newPassword: joi_1.default.string()
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
            .required()
            .messages({
            "string.empty": "Vui lòng nhập mật khẩu mới!",
            "string.min": "Mật khẩu phải có ít nhất 8 ký tự!",
            "password.lowercase": "Mật khẩu phải chứa ký tự thường!",
            "password.uppercase": "Mật khẩu phải chứa ký tự hoa!",
            "password.number": "Mật khẩu phải chứa chữ số!",
            "password.special": "Mật khẩu phải chứa ký tự đặc biệt!",
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
exports.resetPasswordPost = resetPasswordPost;
const profilePatch = async (req, res, next) => {
    const schema = joi_1.default.object({
        fullName: joi_1.default.string().max(50).optional().messages({
            "string.max": "Vui lòng nhập tối đa 50 ký tự cho họ tên!",
        }),
        phone: joi_1.default.string().max(20).optional().messages({
            "string.max": "Vui lòng nhập tối đa 20 ký tự cho số điện thoại!",
        }),
        address: joi_1.default.string().max(200).optional().messages({
            "string.max": "Vui lòng nhập tối đa 200 ký tự cho địa chỉ!",
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
exports.profilePatch = profilePatch;
const changePasswordPatch = async (req, res, next) => {
    const schema = joi_1.default.object({
        currentPassword: joi_1.default.string().required().messages({
            "string.empty": "Vui lòng nhập mật khẩu hiện tại!",
        }),
        newPassword: joi_1.default.string()
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
            .required()
            .messages({
            "string.empty": "Vui lòng nhập mật khẩu mới!",
            "string.min": "Mật khẩu mới phải có ít nhất 8 ký tự!",
            "password.lowercase": "Mật khẩu mới phải chứa ký tự thường!",
            "password.uppercase": "Mật khẩu mới phải chứa ký tự hoa!",
            "password.number": "Mật khẩu mới phải chứa chữ số!",
            "password.special": "Mật khẩu mới phải chứa ký tự đặc biệt!",
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
exports.changePasswordPatch = changePasswordPatch;
