import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const registerPost = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    fullName: Joi.string().min(5).max(50).required().messages({
      "string.empty": "Vui lòng nhập họ tên!",
      "string.min": "Vui lòng nhập ít nhất 5 ký tự!",
      "string.max": "Vui lòng nhập tối đa 50 ký tự!",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Vui lòng nhập email!",
      "string.email": "Email không đúng định dạng!",
    }),
    password: Joi.string()
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

export const loginPost = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Vui lòng nhập email!",
      "string.email": "Email không đúng định dạng!",
    }),
    password: Joi.string()
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
    check: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
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

export const forgotPasswordPost = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
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

export const resetPasswordPost = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Vui lòng nhập email!",
      "string.email": "Email không đúng định dạng!",
    }),
    otp: Joi.string().length(6).required().messages({
      "string.empty": "Vui lòng nhập mã OTP!",
      "string.length": "Mã OTP phải gồm 6 ký tự!",
    }),
    newPassword: Joi.string()
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
