import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Validate payload for creating a new application
export const applyPost = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    jobId: Joi.string().required().messages({
      "string.empty": "Vui lòng chọn công việc!",
    }),
    cvId: Joi.string().optional(),
    email: Joi.string().email().optional().messages({
      "string.email": "Email không đúng định dạng!",
    }),
    userName: Joi.string().max(100).optional().messages({
      "string.max": "Họ tên tối đa 100 ký tự!",
    }),
    phone: Joi.string().max(20).optional().messages({
      "string.max": "Số điện thoại tối đa 20 ký tự!",
    }),
    coverLetter: Joi.string().allow("", null).optional(),
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

export const companyChangeStatusPatch = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    status: Joi.string().trim().valid("initial", "approved", "rejected").required().messages({
      "string.empty": "Vui lòng chọn trạng thái!",
      "any.only": "Trạng thái không hợp lệ!",
    }),
    notes: Joi.string().allow("", null).optional(),
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
