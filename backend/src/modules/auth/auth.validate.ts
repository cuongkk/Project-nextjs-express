import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { AccountRequest } from "../../interfaces/request.interface";

const passwordSchema = Joi.string()
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

export const registerPost = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Vui lòng nhập email!",
      "string.email": "Email không đúng định dạng!",
    }),
    password: passwordSchema.required(),
    role: Joi.string().valid("user", "company", "admin").required().messages({
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

export const loginPost = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Vui lòng nhập email!",
      "string.email": "Email không đúng định dạng!",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập mật khẩu!",
    }),
    rememberMe: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
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

export const refreshTokenPost = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    refreshToken: Joi.string().optional(),
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

export const verifyEmailPost = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Vui lòng nhập email!",
      "string.email": "Email không đúng định dạng!",
    }),
    otp: Joi.string().length(6).required().messages({
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

export const resetPasswordPost = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
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

export const changePasswordPatch = async (req: AccountRequest, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required().messages({
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
