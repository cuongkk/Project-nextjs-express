import Job from "./job.model";
import AccountCompany from "../company/company.model";
import { AccountRequest } from "../../interfaces/request.interface";
import { PAGINATION } from "../../configs/variable.config";

export const list = async () => {
  const limitItems = PAGINATION.JOB_LIST_PAGE_SIZE ?? 10;

  const jobs = await Job.find().sort({ createdAt: "desc" }).limit(limitItems);

  const dataFinal = jobs.map((item) => ({
    id: item.id,
    title: item.title,
    salaryMin: item.salaryMin,
    salaryMax: item.salaryMax,
    position: item.position,
    workingForm: item.workingForm,
    technologies: item.technologies,
  }));

  return {
    code: "success",
    message: "Lấy danh sách công việc thành công!",
    jobs: dataFinal,
  };
};

export const detail = async (id: string) => {
  const record = await Job.findOne({ _id: id });

  if (!record) {
    return {
      code: "error",
      message: "Thất bại!",
    };
  }

  const jobDetail: any = {
    id: record.id,
    title: record.title,
    companyName: "",
    salaryMin: record.salaryMin,
    salaryMax: record.salaryMax,
    images: record.images,
    position: record.position,
    workingForm: record.workingForm,
    companyAddress: "",
    technologies: record.technologies,
    description: record.description,
    companyId: record.companyId,
    companyLogo: "",
    companyModel: "",
    companyEmployees: "",
    companyWorkingTime: "",
    companyWorkOvertime: "",
  };

  const accountCompany = await AccountCompany.findOne({
    _id: record.companyId,
  });

  if (accountCompany) {
    jobDetail.companyName = `${accountCompany.companyName}`;
    jobDetail.companyAddress = `${accountCompany.address}`;
    jobDetail.companyLogo = `${accountCompany.logo}`;
    jobDetail.companyEmployees = `${accountCompany.companyEmployees}`;
    jobDetail.companyWorkingTime = `${accountCompany.workingTime}`;
  }

  return {
    code: "success",
    message: "Thành công!",
    jobDetail,
  };
};

export const create = async (req: AccountRequest) => {
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

export const update = async (req: AccountRequest) => {
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

export const remove = async (req: AccountRequest) => {
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
