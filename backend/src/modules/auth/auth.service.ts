import { Request } from "express";
import AccountUser from "../user/user.model";
import AccountCompany from "../company/company.model";
import ForgotPassword from "./forgotpassword.model";
import RefreshToken from "./auth.model";
import { sendMail } from "../../utils/mail.helper";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/token.util";
import { comparePassword, hashPassword } from "../../utils/password.util";
import { AccountRequest } from "../../interfaces/request.interface";
import bcrypt from "bcryptjs";

export const register = async (req: Request) => {
  const { email, password, role } = req.body as {
    email: string;
    password: string;
    role: "user" | "company" | "admin";
  };

  const existUser = await AccountUser.findOne({ email });
  const existCompany = await AccountCompany.findOne({ email });

  if (existUser || existCompany) {
    return {
      code: "error",
      message: "Email đã tồn tại trong hệ thống!",
    };
  }

  const hashedPassword = await hashPassword(password);

  if (role === "company") {
    const newCompany = new AccountCompany({
      email,
      password: hashedPassword,
      ...req.body,
    });
    await newCompany.save();
  } else {
    const newUser = new AccountUser({
      email,
      password: hashedPassword,
      ...req.body,
    });
    await newUser.save();
  }

  return {
    code: "success",
    message: "Đăng ký thành công!",
  };
};

export const login = async (req: Request) => {
  const { email, password, rememberMe } = req.body as {
    email: string;
    password: string;
    rememberMe?: boolean | string;
  };

  const isRemember = rememberMe === true || rememberMe === "true";

  let account: any = await AccountUser.findOne({ email });
  let role: "user" | "company" = "user";

  if (!account) {
    account = await AccountCompany.findOne({ email });
    role = "company";
  }

  if (!account) {
    return {
      code: "error",
      message: "Email không tồn tại trong hệ thống!",
    };
  }

  const isPasswordValid = await comparePassword(password, `${account.password}`);

  if (!isPasswordValid) {
    return {
      code: "error",
      message: "Mật khẩu không đúng!",
    };
  }

  const payload = { id: account.id, role } as const;

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    userId: account.id,
    token: refreshToken,
    expiresAt,
  });

  const commonInfo: any = {
    id: account.id,
    email: account.email,
  };

  if (role === "user") {
    commonInfo.fullName = account.fullName;
    commonInfo.avatar = account.avatar ?? null;
  } else if (role === "company") {
    commonInfo.companyName = account.companyName;
    commonInfo.logo = account.logo ?? null;
  }

  return {
    code: "success",
    message: "Đăng nhập thành công!",
    tokens: {
      accessToken,
      refreshToken,
      isRemember,
    },
    role,
    info: commonInfo,
  };
};

export const refreshToken = async (req: Request) => {
  const tokenFromCookie = (req as any).cookies?.refreshToken as string | undefined;
  const tokenFromBody = (req.body as any)?.refreshToken as string | undefined;
  const refreshToken = tokenFromCookie || tokenFromBody;

  if (!refreshToken) {
    return {
      code: "error",
      message: "Vui lòng gửi kèm theo refresh token!",
    };
  }

  const existingToken = await RefreshToken.findOne({ token: refreshToken });

  if (!existingToken) {
    return {
      code: "error",
      message: "Refresh token không hợp lệ!",
    };
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    await RefreshToken.deleteOne({ _id: existingToken.id });
    return {
      code: "error",
      message: "Refresh token không hợp lệ!",
    };
  }

  const payload = decoded;

  let account: any = null;
  if (payload.role === "user") {
    account = await AccountUser.findById(payload.id);
  } else if (payload.role === "company") {
    account = await AccountCompany.findById(payload.id);
  }

  if (!account) {
    await RefreshToken.deleteOne({ _id: existingToken.id });
    return {
      code: "error",
      message: "Tài khoản không tồn tại!",
    };
  }

  const newPayload = { id: account.id, role: payload.role } as const;

  const newAccessToken = generateAccessToken(newPayload);
  const newRefreshToken = generateRefreshToken(newPayload);

  existingToken.token = newRefreshToken;
  existingToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await existingToken.save();

  return {
    code: "success",
    message: "Làm mới token thành công!",
    tokens: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
  };
};

export const logout = async (req: Request) => {
  const tokenFromCookie = (req as any).cookies?.refreshToken as string | undefined;
  const refreshToken = tokenFromCookie;

  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }

  return {
    code: "success",
    message: "Đã đăng xuất!",
  };
};

export const forgotPassword = async (req: Request) => {
  const { email } = req.body as { email: string };

  let account: any = await AccountUser.findOne({ email });
  let accountType: "user" | "company" = "user";

  if (!account) {
    account = await AccountCompany.findOne({ email });
    accountType = "company";
  }

  if (!account) {
    return {
      code: "error",
      message: "Email không tồn tại trong hệ thống!",
    };
  }

  const existingOTP = await ForgotPassword.findOne({
    email,
    accountType,
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
    email,
    otp: otpCode,
    accountType,
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

export const resetPassword = async (req: Request) => {
  const { email, otp, newPassword } = req.body as {
    email: string;
    otp: string;
    newPassword: string;
  };

  const existRecord = await ForgotPassword.findOne({
    email,
    otp,
  });

  if (!existRecord) {
    return {
      code: "error",
      message: "Mã OTP không đúng hoặc đã hết hạn!",
    };
  }

  await ForgotPassword.deleteOne({ _id: existRecord.id });

  let account: any = await AccountUser.findOne({ email });
  if (!account) {
    account = await AccountCompany.findOne({ email });
  }

  if (!account) {
    return {
      code: "error",
      message: "Tài khoản không tồn tại!",
    };
  }

  const hash = await hashPassword(newPassword);

  account.password = hash;
  await account.save();

  return {
    code: "success",
    message: "Đặt lại mật khẩu thành công!",
  };
};

export const changePasswordPatch = async (req: AccountRequest) => {
  const { currentPassword, newPassword } = req.body as {
    currentPassword: string;
    newPassword: string;
  };

  const userPayload: any = (req as any).user;

  if (!userPayload || userPayload.role !== "user") {
    return {
      code: "error",
      message: "Không có quyền đổi mật khẩu!",
    };
  }

  const account = await AccountUser.findById(userPayload.id);

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
