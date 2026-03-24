import { Request } from "express";
import CV from "./cv.model";
import Job from "../job/job.model";
import { AccountRequest } from "../../interfaces/request.interface";
import { PAGINATION } from "../../configs/variable.config";
import Application from "../application/application.model";

export const userList = async (req: AccountRequest) => {
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
  const totalPage = Math.ceil(totalRecord / limitItems) || 1;
  const skip = (page - 1) * limitItems;

  const listCV = await CV.find(find)
    .sort({
      createdAt: "desc",
    })
    .limit(limitItems)
    .skip(skip);

  return {
    code: "success",
    message: "Lấy danh sách CV thành công!",
    listCV,
    totalPage,
  };
};

export const companyList = async (req: AccountRequest) => {
  const companyId = req.account.id;

  const listJob = await Job.find({
    companyId: companyId,
  }).select("id");

  const listJobId = listJob.map((item) => item.id);

  const find: any = {
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

  return {
    code: "success",
    message: "Lấy danh sách CV thành công!",
    listCV: dataFinal,
    totalPage: totalPage,
  };
};

export const companyDetail = async (req: AccountRequest) => {
  const companyId = req.account.id;
  const cvId = req.params.id;

  const infoCV = await CV.findOne({
    _id: cvId,
  });

  if (!infoCV) {
    return {
      code: "error",
      message: "Thất bại!",
    };
  }

  const infoJob = await Job.findOne({
    _id: infoCV.jobId,
    companyId: companyId,
  });

  if (!infoJob) {
    return {
      code: "error",
      message: "Thất bại!",
    };
  }

  const dataFinalCV = {
    email: infoCV.email,
    userName: infoCV.userName,
    phone: infoCV.phone,
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

  await CV.updateOne(
    {
      _id: cvId,
    },
    {
      viewed: true,
    },
  );

  return {
    code: "success",
    message: "Thành công!",
    infoCV: dataFinalCV,
    infoJob: dataFinalJob,
  };
};

export const companyChangeStatus = async (req: AccountRequest) => {
  const companyId = req.account.id;
  const cvId = (req.body as any).id;
  const status = (req.body as any).status;

  const infoCV = await CV.findOne({
    _id: cvId,
  });

  if (!infoCV) {
    return {
      code: "error",
      message: "Thất bại!",
    };
  }

  const infoJob = await Job.findOne({
    _id: infoCV.jobId,
    companyId: companyId,
  });

  if (!infoJob) {
    return {
      code: "error",
      message: "Thất bại!",
    };
  }

  await CV.updateOne(
    {
      _id: cvId,
    },
    {
      status: status,
    },
  );

  return {
    code: "success",
    message: "Thành công!",
  };
};

export const companyDelete = async (req: AccountRequest) => {
  const companyId = req.account.id;
  const cvId = req.params.id;

  const infoCV = await CV.findOne({
    _id: cvId,
  });

  if (!infoCV) {
    return {
      code: "error",
      message: "Thất bại!",
    };
  }

  const infoJob = await Job.findOne({
    _id: infoCV.jobId,
    companyId: companyId,
  });

  if (!infoJob) {
    return {
      code: "error",
      message: "Thất bại!",
    };
  }

  await CV.deleteOne({
    _id: cvId,
  });

  return {
    code: "success",
    message: "Đã xóa CV!",
  };
};

export const apply = async (req: Request & { file?: any }) => {
  req.body.fileCV = req.file ? req.file.path : "";

  const cv = await CV.create(req.body);

  const job = await Job.findById(cv.jobId);
  const companyId = job?.companyId ? `${job.companyId}` : "";

  const userId = (req as any).account?.id ?? "";

  await Application.create({
    userId,
    companyId,
    jobId: cv.jobId,
    cvId: cv._id.toString(),
    coverLetter: req.body.coverLetter ?? "",
  });

  return {
    code: "success",
    message: "Đã gửi CV thành công!",
  };
};
