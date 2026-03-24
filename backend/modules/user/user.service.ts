import { Request } from "express";
import AccountUser from "./user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ForgotPassword from "../auth/forgot-password.model";
import { sendMail } from "../../utils/mail.helper";
import { AccountRequest } from "../../interfaces/request.interface";

export const registerPost = async (req: Request) => {
  const { fullName, email, password } = req.body;

  const existAccount = await AccountUser.findOne({
    email: email,
  });

  if (existAccount) {
    return {
      code: "error",
      message: "Email đã tồn tại trong hệ thống!",
    };
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const newAccount = new AccountUser({
    fullName: fullName,
    email: email,
    password: hash,
  });

  await newAccount.save();

  return {
    code: "success",
    message: "Đăng ký thành công!",
  };
};

export const loginPost = async (req: Request) => {
  const { email, password, check } = req.body as {
    email: string;
    password: string;
    check?: boolean | string;
  };

  const isRemember = check === true || check === "true";

  const existAccount = await AccountUser.findOne({
    email: email,
  });

  if (!existAccount) {
    return {
      code: "error",
      message: "Email không tồn tại trong hệ thống!",
    };
  }

  const isPasswordValid = await bcrypt.compare(password, `${existAccount.password}`);

  if (!isPasswordValid) {
    return {
      code: "error",
      message: "Mật khẩu không đúng!",
    };
  }

  const accessToken = jwt.sign(
    {
      id: existAccount.id,
      email: existAccount.email,
    },
    `${process.env.JWT_SECRET}`,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    {
      id: existAccount.id,
      email: existAccount.email,
    },
    `${process.env.JWT_REFRESH_SECRET}`,
    {
      expiresIn: "7d",
    },
  );

  return {
    code: "success",
    message: "Đăng nhập thành công!",
    tokens: {
      accessToken,
      refreshToken,
      isRemember,
    },
    infoUser: {
      id: existAccount.id,
      fullName: existAccount.fullName,
      email: existAccount.email,
      avatar: existAccount.avatar ?? null,
    },
  };
};

export const forgotPasswordPost = async (req: Request) => {
  const { email } = req.body;

  const existAccount = await AccountUser.findOne({
    email: email,
  });

  if (!existAccount) {
    return {
      code: "error",
      message: "Email không tồn tại trong hệ thống!",
    };
  }

  const existingOTP = await ForgotPassword.findOne({
    email: email,
    accountType: "user",
  });

  if (existingOTP) {
    return {
      code: "error",
      message: "Mã OTP đã được gửi. Vui lòng kiểm tra email của bạn!",
    };
  }

  const characters = "0123456789";
  let otpCode = "";
  for (let i = 0; i < 6; i++) {
    otpCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const newRecord = new ForgotPassword({
    email: email,
    otp: otpCode,
    accountType: "user",
    expireAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await newRecord.save();

  const subject = "Mã OTP đặt lại mật khẩu";
  const content = `Mã OTP của bạn là: <b>${otpCode}</b>. Mã có hiệu lực trong 5 phút.`;
  await sendMail(email, subject, content);

  return {
    code: "success",
    message: "Đã gửi mã OTP đến email của bạn!",
  };
};

export const resetPasswordPost = async (req: Request) => {
  const { email, otp, newPassword } = req.body;

  const existRecord = await ForgotPassword.findOne({
    email: email,
    otp: otp,
    accountType: "user",
  });

  if (!existRecord) {
    return {
      code: "error",
      message: "Mã OTP không đúng hoặc đã hết hạn!",
    };
  }

  await ForgotPassword.deleteOne({ _id: existRecord.id });

  const existAccount = await AccountUser.findOne({ email: email });

  if (!existAccount) {
    return {
      code: "error",
      message: "Tài khoản không tồn tại!",
    };
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);

  await AccountUser.updateOne(
    {
      _id: existAccount.id,
    },
    {
      password: hash,
    },
  );

  return {
    code: "success",
    message: "Đặt lại mật khẩu thành công!",
  };
};

export const profilePatch = async (req: AccountRequest) => {
  if (req.file) {
    (req.body as any).avatar = req.file.path;
  } else {
    delete (req.body as any).avatar;
  }

  await AccountUser.updateOne(
    {
      _id: req.account.id,
    },
    req.body,
  );

  return {
    code: "success",
    message: "Cập nhật thành công!",
  };
};

export const changePasswordPatch = async (req: AccountRequest) => {
  const { currentPassword, newPassword } = req.body;

  const account = await AccountUser.findOne({
    _id: req.account.id,
  });

  if (!account) {
    return {
      code: "error",
      message: "Tài khoản không tồn tại!",
    };
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, `${account.password}`);

  if (!isPasswordValid) {
    return {
      code: "error",
      message: "Mật khẩu hiện tại không đúng!",
    };
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);
  account.password = hash;
  await account.save();

  return {
    code: "success",
    message: "Đổi mật khẩu thành công!",
  };
};
