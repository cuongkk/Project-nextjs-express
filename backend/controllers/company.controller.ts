import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import AccountCompany from "../models/account-company.model";
import jwt from "jsonwebtoken";
import { AccountRequest } from "../interfaces/request.interface";
import Job from "../models/job.model";
import City from "../models/city.model";
import CV from "../models/cv.model";
import ForgotPassword from "../models/forgot-password.model";
import { sendMail } from "../helpers/mail.helper";
import { PAGINATION } from "../configs/variable.config";

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
    sameSite: "lax", // Cho phép lấy được cookie từ tên miền khác
    secure: process.env.NODE_ENV === "production", // http: false, https: true
  });

  const refreshCookieOptions: any = {
    httpOnly: true,
    sameSite: "lax", // Cho phép lấy được cookie từ tên miền khác
    secure: process.env.NODE_ENV === "production", // http: false, https: true
  };

  if (isRemember) {
    refreshCookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 ngày
  }

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  res.json({
    code: "success",
    message: "Đăng nhập thành công!",
    infoCompany: {
      id: existAccount.id,
      companyName: existAccount.companyName,
      email: existAccount.email,
      logo: existAccount.logo ?? null,
    },
  });
};

export const forgotPasswordPost = async (req: Request, res: Response) => {
  const { email } = req.body;

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

  const existingOTP = await ForgotPassword.findOne({
    email: email,
    accountType: "company",
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
    accountType: "company",
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
    accountType: "company",
  });

  if (!existRecord) {
    res.json({
      code: "error",
      message: "Mã OTP không đúng hoặc đã hết hạn!",
    });
    return;
  }

  await ForgotPassword.deleteOne({ _id: existRecord.id });

  const existAccount = await AccountCompany.findOne({ email: email });

  if (!existAccount) {
    res.json({
      code: "error",
      message: "Tài khoản không tồn tại!",
    });
    return;
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

  res.json({
    code: "success",
    message: "Đặt lại mật khẩu thành công!",
  });
};

export const profilePatch = async (req: AccountRequest, res: Response) => {
  try {
    if (req.file) {
      req.body.logo = req.file.path;
    } else {
      delete req.body.logo;
    }

    await AccountCompany.updateOne(
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

export const createJobPost = async (req: AccountRequest, res: Response) => {
  try {
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

    res.json({
      code: "success",
      message: "Tạo công việc thành công!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!",
    });
  }
};

export const listJob = async (req: AccountRequest, res: Response) => {
  const find = {
    companyId: req.account.id,
  };

  // Phân trang
  const limitItems = PAGINATION.COMPANY_JOB_PAGE_SIZE;
  let page = 1;
  if (req.query.page) {
    page = parseInt(`${req.query.page}`);
  }
  const totalRecord = await Job.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItems);
  const skip = (page - 1) * limitItems;
  // Hết Phân trang

  const jobs = await Job.find(find)
    .sort({
      createdAt: "desc",
    })
    .limit(limitItems)
    .skip(skip);

  const dataFinal = [];

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

  res.json({
    code: "success",
    message: "Lấy danh sách công việc thành công!",
    jobs: dataFinal,
    totalPage: totalPage,
  });
};

export const editJob = async (req: AccountRequest, res: Response) => {
  try {
    const id = req.params.id;

    const jobDetail = await Job.findOne({
      _id: id,
      companyId: req.account.id,
    });

    if (jobDetail) {
      res.json({
        code: "success",
        message: "Thành công!",
        jobDetail: jobDetail,
      });
    } else {
      res.json({
        code: "error",
        message: "Id không hợp lệ!",
      });
    }
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!",
    });
  }
};

export const editJobPatch = async (req: AccountRequest, res: Response) => {
  try {
    const id = req.params.id;

    const jobDetail = await Job.findOne({
      _id: id,
      companyId: req.account.id,
    });

    if (!jobDetail) {
      res.json({
        code: "error",
        message: "Id không hợp lệ!",
      });
      return;
    }

    req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
    req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
    req.body.technologies = req.body.technologies ? req.body.technologies.split(", ") : [];
    // Giữ nguyên danh sách ảnh cũ nếu không upload ảnh mới
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

    res.json({
      code: "success",
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!",
    });
  }
};

export const deleteJobDel = async (req: AccountRequest, res: Response) => {
  try {
    const id = req.params.id;

    const jobDetail = await Job.findOne({
      _id: id,
      companyId: req.account.id,
    });

    if (!jobDetail) {
      res.json({
        code: "error",
        message: "Id không hợp lệ!",
      });
      return;
    }

    await Job.deleteOne({
      _id: id,
      companyId: req.account.id,
    });

    res.json({
      code: "success",
      message: "Đã xóa công việc!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!",
    });
  }
};

export const list = async (req: AccountRequest, res: Response) => {
  const find: any = {};

  let limitItems = PAGINATION.COMPANY_LIST_PAGE_SIZE;
  if (req.query.limitItems) {
    limitItems = parseInt(`${req.query.limitItems}`);
  }

  // Phân trang
  let page = 1;
  if (req.query.page) {
    page = parseInt(`${req.query.page}`);
  }
  const totalRecord = await AccountCompany.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItems);
  const skip = (page - 1) * limitItems;
  // Hết Phân trang

  const companyList = await AccountCompany.find(find)
    .sort({
      createdAt: "desc",
    })
    .limit(limitItems)
    .skip(skip);

  const companyListFinal = [];

  for (const item of companyList) {
    const dataItemFinal = {
      id: item.id,
      logo: item.logo,
      companyName: item.companyName,
      cityName: "",
      totalJob: 0,
    };

    // Thành phố
    const city = await City.findOne({
      _id: item.city,
    });
    dataItemFinal.cityName = `${city?.name}`;

    // Tổng số việc làm
    const totalJob = await Job.countDocuments({
      companyId: item.id,
    });
    dataItemFinal.totalJob = totalJob;

    // Thêm vào mảng danh sách công ty
    companyListFinal.push(dataItemFinal);
  }

  res.json({
    code: "success",
    message: "Thành công!",
    companyList: companyListFinal,
    totalPage: totalPage,
  });
};

export const detail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const record = await AccountCompany.findOne({
      _id: id,
    });

    if (record) {
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

      const dataFinal = [];
      for (const item of jobs) {
        const itemFinal = {
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

      res.json({
        code: "success",
        message: "Thành công!",
        companyDetail: companyDetail,
        jobs: dataFinal,
      });
    } else {
      res.json({
        code: "error",
        message: "Thất bại!",
      });
    }
  } catch (error) {
    res.json({
      code: "error",
      message: "Thất bại!",
    });
  }
};

export const listCV = async (req: AccountRequest, res: Response) => {
  const companyId = req.account.id;

  // Lấy tất cả job của công ty hiện tại
  const listJob = await Job.find({
    companyId: companyId,
  }).select("id");

  const listJobId = listJob.map((item) => item.id);

  const find = {
    jobId: { $in: listJobId },
  };

  const limitItems = PAGINATION.COMPANY_CV_PAGE_SIZE;
  let page = 1;
  if (req.query.page) {
    page = parseInt(`${req.query.page}`);
  }

  const totalRecord = await CV.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItems) || 1;
  const skip = (page - 1) * limitItems;

  const listCV = await CV.find(find)
    .sort({
      createdAt: "desc",
    })
    .limit(limitItems)
    .skip(skip);

  const dataFinal: any[] = [];

  for (const item of listCV) {
    const dataItemFinal: any = {
      id: item.id,
      jobTitle: "",
      email: item.email,
      userName: item.userName,
      phone: item.phone,
      jobSalaryMin: 0,
      jobSalaryMax: 0,
      jobPosition: "",
      jobWorkingForm: "",
      viewed: item.viewed,
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
    }

    dataFinal.push(dataItemFinal);
  }

  res.json({
    code: "success",
    message: "Lấy danh sách CV thành công!",
    listCV: dataFinal,
    totalPage: totalPage,
  });
};

export const detailCV = async (req: AccountRequest, res: Response) => {
  try {
    const companyId = req.account.id;
    const cvId = req.params.id;

    const infoCV = await CV.findOne({
      _id: cvId,
    });

    if (!infoCV) {
      res.json({
        code: "error",
        message: "Thất bại!",
      });
      return;
    }

    const infoJob = await Job.findOne({
      _id: infoCV.jobId,
      companyId: companyId,
    });

    if (!infoJob) {
      res.json({
        code: "error",
        message: "Thất bại!",
      });
      return;
    }

    const dataFinalCV = {
      email: infoCV.email,
      fileCV: infoCV.fileCV,
    };

    const dataFinalJob = {
      id: infoJob.id,
      title: infoJob.title,
      salaryMin: infoJob.salaryMin,
      salaryMax: infoJob.salaryMax,
      position: infoJob.position,
      workingForm: infoJob.workingForm,
      technologies: infoJob.technologies,
    };

    // Cập nhật trạng thái thành đã xem
    await CV.updateOne(
      {
        _id: cvId,
      },
      {
        viewed: true,
      },
    );

    res.json({
      code: "success",
      message: "Thành công!",
      infoCV: dataFinalCV,
      infoJob: dataFinalJob,
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Thất bại!",
    });
  }
};

export const changeStatusCVPatch = async (req: AccountRequest, res: Response) => {
  try {
    const companyId = req.account.id;
    const cvId = req.body.id;
    const status = req.body.status;

    const infoCV = await CV.findOne({
      _id: cvId,
    });

    if (!infoCV) {
      res.json({
        code: "error",
        message: "Thất bại!",
      });
      return;
    }

    const infoJob = await Job.findOne({
      _id: infoCV.jobId,
      companyId: companyId,
    });

    if (!infoJob) {
      res.json({
        code: "error",
        message: "Thất bại!",
      });
      return;
    }

    await CV.updateOne(
      {
        _id: cvId,
      },
      {
        status: status,
      },
    );

    res.json({
      code: "success",
      message: "Thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Thất bại!",
    });
  }
};

export const deleteCVDel = async (req: AccountRequest, res: Response) => {
  try {
    const companyId = req.account.id;
    const cvId = req.params.id;

    const infoCV = await CV.findOne({
      _id: cvId,
    });

    if (!infoCV) {
      res.json({
        code: "error",
        message: "Thất bại!",
      });
      return;
    }

    const infoJob = await Job.findOne({
      _id: infoCV.jobId,
      companyId: companyId,
    });

    if (!infoJob) {
      res.json({
        code: "error",
        message: "Thất bại!",
      });
      return;
    }

    await CV.deleteOne({
      _id: cvId,
    });

    res.json({
      code: "success",
      message: "Đã xóa CV!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Thất bại!",
    });
  }
};
