import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import AccountCompany from "../models/account-company.model";
import jwt from "jsonwebtoken";

export const registerPost = async (req: Request, res: Response) => {
  const { companyName, email, password } = req.body;

  const existAccount = await AccountCompany.findOne({
    email: email,
  });

  if (existAccount) {
    res.json({
      code: "error",
      message: "Email đã tồn tại trong hệ thống!",
    });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const newAccount = new AccountCompany({
    companyName: companyName,
    email: email,
    password: hash,
  });

  await newAccount.save();

  res.json({
    code: "success",
    message: "Đăng ký tài khoản thành công!",
  });
};

export const loginPost = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Kiểm tra email
  const existAccount = await AccountCompany.findOne({
    email: email,
  });

  if (!existAccount) {
    res.json({
      code: "error",
      message: "Email không tồn tại trong hệ thống!",
    });
    return;
  }

  // Kiểm tra mật khẩu
  const isPasswordValid = await bcrypt.compare(password, `${existAccount.password}`);

  if (!isPasswordValid) {
    res.json({
      code: "error",
      message: "Mật khẩu không đúng!",
    });
    return;
  }

  // Tạo JWT
  const token = jwt.sign(
    {
      id: existAccount.id,
      email: existAccount.email,
    },
    `${process.env.JWT_SECRET}`,
    {
      expiresIn: "1d",
    },
  );

  // Lưu token vào cookie
  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000, // 1 ngày
    httpOnly: true, // Chỉ cho phép cookie được truy cập bởi server
    sameSite: "lax", // Cho phép lấy được cookie từ tên miền khác
    secure: process.env.NODE_ENV === "production", // http: false, https: true
  });

  res.json({
    code: "success",
    message: "Đăng nhập thành công!",
  });
};
