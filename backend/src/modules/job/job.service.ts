import Job from "./job.model";
import City from "../city/city.model";
import AccountCompany from "../company/company.model";
import Application from "../application/application.model";
import CV from "../cv/cv.model";
import { AccountRequest } from "../../interfaces/request.interface";
import { JOB_EXPIRE_DAYS, PAGINATION } from "../../configs/variable.config";

export const all = async () => {
  const [totalJobs, cities, title, techArrays, companyIds] = await Promise.all([
    Job.countDocuments(),
    Job.find().distinct("city"),
    Job.find().distinct("title"),
    Job.find().distinct("technologies"),
    Job.find().distinct("companyId"),
  ]);

  const [listCity, companies] = await Promise.all([City.find({ _id: { $in: cities } }), AccountCompany.find({ _id: { $in: companyIds } }).select("_id companyName")]);

  const techList = Array.from(new Set((techArrays as string[]).flat()));

  return {
    code: "success",
    total: totalJobs,
    listCity: listCity,
    title: title,
    techList: techList,
    companies: companies,
  };
};

export const list = async (companyId: string) => {
  const limitItems = PAGINATION.JOB_LIST_PAGE_SIZE ?? 10;

  const jobs = await Job.find({ companyId }).sort({ createdAt: "desc" }).limit(limitItems);

  const company = await AccountCompany.findById(companyId);

  const city = await City.findById(company?.city);
  const dataFinal = jobs.map((item) => ({
    id: item._id,

    title: item.title,
    salaryMin: item.salaryMin,
    salaryMax: item.salaryMax,
    position: item.position,
    workingForm: item.workingForm,
    technologies: item.technologies,
    status: item.status,
    expiresAt: item.expiresAt,
    companyCity: city?.name,
    companyLogo: company?.logo,
  }));

  return {
    code: "success",
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

  const now = new Date();
  const isExpiredByTime = !!record.expiresAt && record.expiresAt < now;
  const isInactiveStatus = !!record.status && record.status !== "active";

  if (isExpiredByTime || isInactiveStatus) {
    return {
      code: "error",
      message: "Công việc đã hết hạn hoặc không còn tuyển dụng!",
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
  req.body.technologies = req.body.technologies || [];
  req.body.images = [];

  // Thiết lập thời hạn job nếu chưa có
  if (!req.body.expiresAt) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + JOB_EXPIRE_DAYS * 24 * 60 * 60 * 1000);
    req.body.expiresAt = expiresAt;
  }

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
  req.body.technologies = req.body.technologies || [];
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

  // Chỉ được xóa khi job đã hết hạn
  const now = new Date();
  const isExpiredByTime = !!jobDetail.expiresAt && jobDetail.expiresAt < now;

  if (!isExpiredByTime) {
    return {
      code: "error",
      message: "Chỉ có thể xóa công việc sau khi đã hết hạn!",
    };
  }

  // Xóa tất cả đơn ứng tuyển liên quan đến job này
  await Application.deleteMany({ jobId: id });

  // Xóa tất cả CV liên quan đến job này (CV tạo ra khi ứng tuyển)
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
