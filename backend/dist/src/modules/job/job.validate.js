"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPatch = exports.createPost = void 0;
const joi_1 = __importDefault(require("joi"));
const jobSchema = joi_1.default.object({
    title: joi_1.default.string().max(200).required().messages({
        "string.empty": "Vui lòng nhập tiêu đề công việc!",
        "string.max": "Tiêu đề tối đa 200 ký tự!",
    }),
    salaryMin: joi_1.default.number().min(0).required().messages({
        "number.base": "Lương tối thiểu phải là số!",
        "number.min": "Lương tối thiểu không được nhỏ hơn 0!",
        "any.required": "Vui lòng nhập lương tối thiểu!",
    }),
    salaryMax: joi_1.default.number().min(0).required().messages({
        "number.base": "Lương tối đa phải là số!",
        "number.min": "Lương tối đa không được nhỏ hơn 0!",
        "any.required": "Vui lòng nhập lương tối đa!",
    }),
    position: joi_1.default.string().max(100).optional().messages({
        "string.empty": "Vui lòng nhập vị trí!",
        "string.max": "Vị trí tối đa 100 ký tự!",
    }),
    workingForm: joi_1.default.string().max(100).optional().messages({
        "string.empty": "Vui lòng nhập hình thức làm việc!",
        "string.max": "Hình thức làm việc tối đa 100 ký tự!",
    }),
    type: joi_1.default.string().valid("remote", "onsite", "hybrid", "full-time", "part-time").optional(),
    level: joi_1.default.string().valid("intern", "junior", "middle", "senior", "fresher", "manager").optional(),
    location: joi_1.default.string().max(200).optional(),
    companyName: joi_1.default.string().max(200).optional(),
    technologies: joi_1.default.array().items(joi_1.default.string().max(50)).max(20).optional().messages({
        "array.base": "Công nghệ phải là danh sách!",
        "array.max": "Tối đa 20 công nghệ!",
        "string.max": "Tên công nghệ tối đa 50 ký tự!",
    }),
    techStack: joi_1.default.array().items(joi_1.default.string().max(50)).max(20).optional(),
    description: joi_1.default.string().allow("", null).optional(),
    requirements: joi_1.default.string().allow("", null).optional(),
    benefits: joi_1.default.string().allow("", null).optional(),
    status: joi_1.default.string().valid("open", "closed", "active", "expired").optional(),
    expiresAt: joi_1.default.date().optional(),
}).unknown(true);
const createPost = async (req, res, next) => {
    const { error } = jobSchema.validate(req.body);
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
exports.createPost = createPost;
const editPatch = async (req, res, next) => {
    const { error } = jobSchema.validate(req.body);
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
exports.editPatch = editPatch;
