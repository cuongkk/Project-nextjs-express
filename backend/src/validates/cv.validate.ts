import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const applyPost = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    jobId: Joi.string().required().messages({
      "string.empty": "Vui lòng chọn công việc!",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Vui lòng nhập email!",
      "string.email": "Email không đúng định dạng!",
    }),
    userName: Joi.string().max(100).required().messages({
      "string.empty": "Vui lòng nhập họ tên!",
      "string.max": "Họ tên tối đa 100 ký tự!",
    }),
    phone: Joi.string().max(20).required().messages({
      "string.empty": "Vui lòng nhập số điện thoại!",
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
    id: Joi.string().required().messages({
      "string.empty": "Vui lòng chọn CV!",
    }),
    status: Joi.string().required().messages({
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
