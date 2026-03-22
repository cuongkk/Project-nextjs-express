import { Request, Response } from "express";
import AccountUser from "../models/account-user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AccountRequest } from "../interfaces/request.interface";
import CV from "../models/cv.model";
import Job from "../models/job.model";
import AccountCompany from "../models/account-company.model";
import ForgotPassword from "../models/forgot-password.model";
import { sendMail } from "../helpers/mail.helper";
import { PAGINATION } from "../configs/variable.config";

export const registerPost = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  const existAccount = await AccountUser.findOne({
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

  const newAccount = new AccountUser({
    fullName: fullName,
    email: email,
    password: hash,
  });

  await newAccount.save();

  res.json({
    code: "success",
    message: "Đăng ký thành công!",
  });
};

export const loginPost = async (req: Request, res: Response) => {
  const { email, password, checked, rememberMe } = req.body as {
    email: string;
    password: string;
    checked?: boolean | string;
    rememberMe?: boolean | string;
  };

  const isRemember = checked === true || checked === "true" || rememberMe === true || rememberMe === "true";

  const existAccount = await AccountUser.findOne({
    email: email,
  });

  if (!existAccount) {
    res.json({
      code: "error",
      message: "Email không tồn tại trong hệ thống!",
    });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, `${existAccount.password}`);

  if (!isPasswordValid) {
    res.json({
      code: "error",
      message: "Mật khẩu không đúng!",
    });
    return;
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

  res.cookie("accessToken", accessToken, {
    maxAge: 15 * 60 * 1000, // 15 phút
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  const refreshCookieOptions: any = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };

  if (isRemember) {
    refreshCookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 ngày
  }

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  res.json({
    code: "success",
    message: "Đăng nhập thành công!",
  });
};

export const forgotPasswordPost = async (req: Request, res: Response) => {
  const { email } = req.body;

  const existAccount = await AccountUser.findOne({
    email: email,
  });

  if (!existAccount) {
    res.json({
      code: "error",
      message: "Email không tồn tại trong hệ thống!",
    });
    return;
  }

  const existingOTP = await ForgotPassword.findOne({
    email: email,
    accountType: "user",
  });

  if (existingOTP) {
    res.json({
      code: "error",
      message: "Mã OTP đã được gửi. Vui lòng kiểm tra email của bạn!",
    });
    return;
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

  res.json({
    code: "success",
    message: "Đã gửi mã OTP đến email của bạn!",
  });
};

export const resetPasswordPost = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;

  const existRecord = await ForgotPassword.findOne({
    email: email,
    otp: otp,
    accountType: "user",
  });

  if (!existRecord) {
    res.json({
      code: "error",
      message: "Mã OTP không đúng hoặc đã hết hạn!",
    });
    return;
  }

  await ForgotPassword.deleteOne({ _id: existRecord.id });

  const existAccount = await AccountUser.findOne({ email: email });

  if (!existAccount) {
    res.json({
      code: "error",
      message: "Tài khoản không tồn tại!",
    });
    return;
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

  res.json({
    code: "success",
    message: "Đặt lại mật khẩu thành công!",
  });
};

export const profilePatch = async (req: AccountRequest, res: Response) => {
  try {
    if (req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }

    await AccountUser.updateOne(
      {
        _id: req.account.id,
      },
      req.body,
    );

    res.json({
      code: "success",
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Cập nhật không thành công!",
    });
  }
};

export const listCV = async (req: AccountRequest, res: Response) => {
  const userEmail = req.account.email;

  const find = {
    email: userEmail,
  };

  const limitItems = PAGINATION.USER_CV_PAGE_SIZE;
  let page = 1;
  if (req.query.page) {
    page = parseInt(`${req.query.page}`);
  }

  const totalRecord = await CV.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / PAGINATION.USER_CV_PAGE_SIZE) || 1;
  const skip = (page - 1) * PAGINATION.USER_CV_PAGE_SIZE;

  const listCV = await CV.find(find)
    .sort({
      createdAt: "desc",
    })
    .limit(limitItems)
    .skip(skip);

  const dataFinal = [];

  for (const item of listCV) {
    const dataItemFinal = {
      id: item.id,
      jobTitle: "",
      companyName: "",
      jobSalaryMin: 0,
      jobSalaryMax: 0,
      jobPosition: "",
      jobWorkingForm: "",
      status: item.status,
    };

    const infoJob = await Job.findOne({
      _id: item.jobId,
    });

    if (infoJob) {
      dataItemFinal.jobTitle = `${infoJob.title}`;
      dataItemFinal.jobSalaryMin = parseInt(`${infoJob.salaryMin}`);
      dataItemFinal.jobSalaryMax = parseInt(`${infoJob.salaryMax}`);
      dataItemFinal.jobPosition = `${infoJob.position}`;
      dataItemFinal.jobWorkingForm = `${infoJob.workingForm}`;

      const infoCompany = await AccountCompany.findOne({
        _id: infoJob.companyId,
      });

      if (infoCompany) {
        dataItemFinal.companyName = `${infoCompany.companyName}`;
        dataFinal.push(dataItemFinal);
      }
    }
  }

  res.json({
    code: "success",
    message: "Lấy danh sách CV thành công!",
    listCV: dataFinal,
    totalPage: totalPage,
  });
};

export const changePasswordPatch = async (req: AccountRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    await AccountUser.findOne({
      _id: req.account.id,
    }).then(async (account) => {
      if (!account) {
        res.json({
          code: "error",
          message: "Tài khoản không tồn tại!",
        });
        return;
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, `${account.password}`);

      if (!isPasswordValid) {
        res.json({
          code: "error",
          message: "Mật khẩu hiện tại không đúng!",
        });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);
      account.password = hash;
      await account.save();

      res.json({
        code: "success",
        message: "Đổi mật khẩu thành công!",
      });
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Đổi mật khẩu không thành công!",
    });
  }
};
