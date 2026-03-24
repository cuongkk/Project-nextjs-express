import { Request } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AccountCompany from "./company.model";
import { AccountRequest } from "../../interfaces/request.interface";
import Job from "../job/job.model";
import City from "../city/city.model";
import ForgotPassword from "../auth/forgot-password.model";
import { sendMail } from "../../utils/mail.helper";
import { PAGINATION } from "../../configs/variable.config";

export const registerPost = async (req: Request) => {
  const { companyName, email, password } = req.body;

  const existAccount = await AccountCompany.findOne({
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

  const newAccount = new AccountCompany({
    companyName: companyName,
    email: email,
    password: hash,
  });

  await newAccount.save();

  return {
    code: "success",
    message: "Đăng ký tài khoản thành công!",
  };
};

export const loginPost = async (req: Request) => {
  const { email, password, check } = req.body as {
    email: string;
    password: string;
    check?: boolean | string;
  };

  const isRemember = check === true || check === "true";

  const existAccount = await AccountCompany.findOne({
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
    infoCompany: {
      id: existAccount.id,
      companyName: existAccount.companyName,
      email: existAccount.email,
      logo: existAccount.logo ?? null,
    },
  };
};

export const forgotPasswordPost = async (req: Request) => {
  const { email } = req.body;

  const existAccount = await AccountCompany.findOne({
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
    accountType: "company",
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
    accountType: "company",
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
    accountType: "company",
  });

  if (!existRecord) {
    return {
      code: "error",
      message: "Mã OTP không đúng hoặc đã hết hạn!",
    };
  }

  await ForgotPassword.deleteOne({ _id: existRecord.id });

  const existAccount = await AccountCompany.findOne({ email: email });

  if (!existAccount) {
    return {
      code: "error",
      message: "Tài khoản không tồn tại!",
    };
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);

  await AccountCompany.updateOne(
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
    (req.body as any).logo = req.file.path;
  } else {
    delete (req.body as any).logo;
  }

  await AccountCompany.updateOne(
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

export const createJobPost = async (req: AccountRequest) => {
  req.body.companyId = req.account.id;
  req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
  req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
  req.body.technologies = req.body.technologies ? req.body.technologies.split(", ") : [];
  req.body.images = [];

  if (req.files) {
    for (const file of req.files as any[]) {
      req.body.images.push(file.path);
    }
  }

  const newRecord = new Job(req.body);
  await newRecord.save();

  return {
    code: "success",
    message: "Tạo công việc thành công!",
  };
};

export const listJob = async (req: AccountRequest) => {
  const find = {
    companyId: req.account.id,
  };

  const limitItems = PAGINATION.COMPANY_JOB_PAGE_SIZE;
  let page = 1;
  if (req.query.page) {
    page = parseInt(`${req.query.page}`);
  }
  const totalRecord = await Job.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItems);
  const skip = (page - 1) * limitItems;

  const jobs = await Job.find(find)
    .sort({
      createdAt: "desc",
    })
    .limit(limitItems)
    .skip(skip);

  const dataFinal: any[] = [];

  for (const item of jobs) {
    dataFinal.push({
      id: item.id,
      title: item.title,
      salaryMin: item.salaryMin,
      salaryMax: item.salaryMax,
      position: item.position,
      workingForm: item.workingForm,
      technologies: item.technologies,
    });
  }

  return {
    code: "success",
    message: "Lấy danh sách công việc thành công!",
    jobs: dataFinal,
    totalPage: totalPage,
  };
};

export const editJob = async (req: AccountRequest) => {
  const id = req.params.id;

  const jobDetail = await Job.findOne({
    _id: id,
    companyId: req.account.id,
  });

  if (jobDetail) {
    return {
      code: "success",
      message: "Thành công!",
      jobDetail: jobDetail,
    };
  }

  return {
    code: "error",
    message: "Id không hợp lệ!",
  };
};

export const editJobPatch = async (req: AccountRequest) => {
  const id = req.params.id;

  const jobDetail = await Job.findOne({
    _id: id,
    companyId: req.account.id,
  });

  if (!jobDetail) {
    return {
      code: "error",
      message: "Id không hợp lệ!",
    };
  }

  req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
  req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
  req.body.technologies = req.body.technologies ? req.body.technologies.split(", ") : [];
  req.body.images = jobDetail.images;

  if (req.files && (req.files as any[]).length > 0) {
    req.body.images = [];
    for (const file of req.files as any[]) {
      req.body.images.push(file.path);
    }
  }

  await Job.updateOne(
    {
      _id: id,
      companyId: req.account.id,
    },
    req.body,
  );

  return {
    code: "success",
    message: "Cập nhật thành công!",
  };
};

export const deleteJobDel = async (req: AccountRequest) => {
  const id = req.params.id;

  const jobDetail = await Job.findOne({
    _id: id,
    companyId: req.account.id,
  });

  if (!jobDetail) {
    return {
      code: "error",
      message: "Id không hợp lệ!",
    };
  }

  await Job.deleteOne({
    _id: id,
    companyId: req.account.id,
  });

  return {
    code: "success",
    message: "Đã xóa công việc!",
  };
};

export const list = async (req: Request) => {
  const find: any = {};

  let limitItems = PAGINATION.COMPANY_LIST_PAGE_SIZE;
  if (req.query.limitItems) {
    limitItems = parseInt(`${req.query.limitItems}`);
  }

  let page = 1;
  if (req.query.page) {
    page = parseInt(`${req.query.page}`);
  }
  const totalRecord = await AccountCompany.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItems);
  const skip = (page - 1) * limitItems;

  const companyList = await AccountCompany.find(find)
    .sort({
      createdAt: "desc",
    })
    .limit(limitItems)
    .skip(skip);

  const companyListFinal: any[] = [];

  for (const item of companyList) {
    const dataItemFinal: any = {
      id: item.id,
      logo: item.logo,
      companyName: item.companyName,
      cityName: "",
      totalJob: 0,
    };

    const city = await City.findOne({
      _id: item.city,
    });
    dataItemFinal.cityName = `${city?.name}`;

    const totalJob = await Job.countDocuments({
      companyId: item.id,
    });
    dataItemFinal.totalJob = totalJob;

    companyListFinal.push(dataItemFinal);
  }

  return {
    code: "success",
    message: "Thành công!",
    companyList: companyListFinal,
    totalPage: totalPage,
  };
};

export const detail = async (req: Request) => {
  const id = req.params.id;

  const record = await AccountCompany.findOne({
    _id: id,
  });

  if (!record) {
    return {
      code: "error",
      message: "Thất bại!",
    };
  }

  const companyDetail = {
    id: record.id,
    logo: record.logo,
    companyName: record.companyName,
    address: record.address,
    companyEmployees: record.companyEmployees,
    workingTime: record.workingTime,
    description: record.description,
  };

  const jobs = await Job.find({
    companyId: id,
  }).sort({
    createdAt: "desc",
  });

  const dataFinal: any[] = [];
  for (const item of jobs) {
    const itemFinal: any = {
      id: item.id,
      companyLogo: record.logo,
      title: item.title,
      companyName: record.companyName,
      salaryMin: item.salaryMin,
      salaryMax: item.salaryMax,
      position: item.position,
      workingForm: item.workingForm,
      companyCity: "",
      technologies: item.technologies,
    };

    const city = await City.findOne({
      _id: record.city,
    });
    itemFinal.companyCity = `${city?.name}`;

    dataFinal.push(itemFinal);
  }

  return {
    code: "success",
    message: "Thành công!",
    companyDetail,
    jobs: dataFinal,
  };
};
