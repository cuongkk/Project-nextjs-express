import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const jobSchema = Joi.object({
  title: Joi.string().max(200).required().messages({
    "string.empty": "Vui lòng nhập tiêu đề công việc!",
    "string.max": "Tiêu đề tối đa 200 ký tự!",
  }),
  salaryMin: Joi.number().min(0).required().messages({
    "number.base": "Lương tối thiểu phải là số!",
    "number.min": "Lương tối thiểu không được nhỏ hơn 0!",
    "any.required": "Vui lòng nhập lương tối thiểu!",
  }),
  salaryMax: Joi.number().min(0).required().messages({
    "number.base": "Lương tối đa phải là số!",
    "number.min": "Lương tối đa không được nhỏ hơn 0!",
    "any.required": "Vui lòng nhập lương tối đa!",
  }),
  position: Joi.string().max(100).required().messages({
    "string.empty": "Vui lòng nhập vị trí!",
    "string.max": "Vị trí tối đa 100 ký tự!",
  }),
  workingForm: Joi.string().max(100).required().messages({
    "string.empty": "Vui lòng nhập hình thức làm việc!",
    "string.max": "Hình thức làm việc tối đa 100 ký tự!",
  }),
  technologies: Joi.array().items(Joi.string().max(50)).max(20).optional().messages({
    "array.base": "Công nghệ phải là danh sách!",
    "array.max": "Tối đa 20 công nghệ!",
    "string.max": "Tên công nghệ tối đa 50 ký tự!",
  }),
  description: Joi.string().allow("", null).optional(),
}).unknown(true);

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
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

export const editPatch = async (req: Request, res: Response, next: NextFunction) => {
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
