"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyChangeStatusPatch = exports.applyPost = void 0;
const joi_1 = __importDefault(require("joi"));
const applyPost = async (req, res, next) => {
    const schema = joi_1.default.object({
        jobId: joi_1.default.string().required().messages({
            "string.empty": "Vui lòng chọn công việc!",
        }),
        email: joi_1.default.string().email().required().messages({
            "string.empty": "Vui lòng nhập email!",
            "string.email": "Email không đúng định dạng!",
        }),
        userName: joi_1.default.string().max(100).required().messages({
            "string.empty": "Vui lòng nhập họ tên!",
            "string.max": "Họ tên tối đa 100 ký tự!",
        }),
        phone: joi_1.default.string().max(20).required().messages({
            "string.empty": "Vui lòng nhập số điện thoại!",
            "string.max": "Số điện thoại tối đa 20 ký tự!",
        }),
        coverLetter: joi_1.default.string().allow("", null).optional(),
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
exports.applyPost = applyPost;
const companyChangeStatusPatch = async (req, res, next) => {
    const schema = joi_1.default.object({
        id: joi_1.default.string().required().messages({
            "string.empty": "Vui lòng chọn CV!",
        }),
        status: joi_1.default.string().required().messages({
            "string.empty": "Vui lòng chọn trạng thái!",
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
exports.companyChangeStatusPatch = companyChangeStatusPatch;
