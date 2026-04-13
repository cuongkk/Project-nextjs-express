"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.companySetInterviewDatePatch = exports.companyChangeStatusPatch = exports.applyPost = void 0;
const joi_1 = __importDefault(require("joi"));
// Validate payload for creating a new application
const applyPost = async (req, res, next) => {
    const schema = joi_1.default.object({
        jobId: joi_1.default.string().required().messages({
            "string.empty": "Vui lòng chọn công việc!",
        }),
        cvId: joi_1.default.string().optional(),
        email: joi_1.default.string().email().optional().messages({
            "string.email": "Email không đúng định dạng!",
        }),
        userName: joi_1.default.string().max(100).optional().messages({
            "string.max": "Họ tên tối đa 100 ký tự!",
        }),
        phone: joi_1.default.string().max(20).optional().messages({
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
        status: joi_1.default.string().trim().valid("applied", "screening", "interview", "offer", "hired", "rejected", "accepted", "viewed", "pending").required().messages({
            "string.empty": "Vui lòng chọn trạng thái!",
            "any.only": "Trạng thái không hợp lệ!",
        }),
        notes: joi_1.default.string().allow("", null).optional(),
        note: joi_1.default.string().allow("", null).optional(),
        interviewDate: joi_1.default.date().optional(),
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
const companySetInterviewDatePatch = async (req, res, next) => {
    const schema = joi_1.default.object({
        interviewDate: joi_1.default.date().required().messages({
            "any.required": "Vui lòng chọn lịch phỏng vấn!",
            "date.base": "Lịch phỏng vấn không hợp lệ!",
        }),
        note: joi_1.default.string().allow("", null).optional(),
    }).unknown(true);
    const { error } = schema.validate(req.body);
    if (error) {
        res.json({
            code: "error",
            message: error.details[0].message,
        });
        return;
    }
    next();
};
exports.companySetInterviewDatePatch = companySetInterviewDatePatch;
