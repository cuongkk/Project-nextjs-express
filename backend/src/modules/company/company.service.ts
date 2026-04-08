import { Request } from "express";
import AccountCompany from "./company.model";
import { AccountRequest } from "../../interfaces/request.interface";
import Job from "../job/job.model";
import City from "../city/city.model";
import Application from "../application/application.model";
import CV from "../cv/cv.model";
import { PAGINATION } from "../../configs/variable.config";

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

  const now = new Date();
  const isExpiredByTime = !!jobDetail.expiresAt && jobDetail.expiresAt < now;

  if (!isExpiredByTime) {
    return {
      code: "error",
      message: "Chỉ có thể xóa công việc sau khi đã hết hạn!",
    };
  }

  await Application.deleteMany({ jobId: id });

  await CV.deleteMany({ jobId: id });

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

    const now = new Date();
    const totalJob = await Job.countDocuments({
      companyId: item.id,
      status: "active",
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gte: now } }],
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
    status: "active",
    $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gte: new Date() } }],
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
