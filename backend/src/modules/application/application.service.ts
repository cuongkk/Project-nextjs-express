import { AccountRequest } from "../../interfaces/request.interface";
import Application from "./application.model";
import Job from "../job/job.model";
import AccountCompany from "../company/company.model";
import CV from "../cv/cv.model";
import { PAGINATION } from "../../configs/variable.config";

export const apply = async (req: AccountRequest & { file?: any }) => {
  const userId = req.account.id;
  const { jobId, cvId, email, userName, phone } = req.body as {
    jobId: string;
    cvId?: string;
    email?: string;
    userName?: string;
    phone?: string;
  };

  const job = await Job.findById(jobId);
  if (!job) {
    return { code: "error", message: "Công việc không tồn tại!" };
  }

  const companyId = job.companyId ? `${job.companyId}` : "";
  if (!companyId) {
    return { code: "error", message: "Công việc không hợp lệ!" };
  }

  let finalCvId = cvId;

  if (!finalCvId) {
    if (!email || !userName || !phone) {
      return { code: "error", message: "Thiếu thông tin CV để ứng tuyển!" };
    }

    const filePath = (req as any).file ? (req as any).file.path : (req.body as any).fileCV || "";

    const cv = await CV.create({
      jobId,
      email,
      userName,
      phone,
      fileCV: filePath,
    });

    finalCvId = cv._id.toString();
  } else {
    const cv = await CV.findOne({ _id: finalCvId, email });
    if (!cv) {
      return { code: "error", message: "CV không hợp lệ hoặc không thuộc về tài khoản hiện tại!" };
    }
  }

  await Application.create({
    userId,
    companyId,
    jobId,
    cvId: finalCvId,
  });

  return {
    code: "success",
    message: "Đã gửi đơn ứng tuyển thành công!",
  };
};

export const userList = async (req: AccountRequest) => {
  const userId = req.account.id;
  const find: any = { userId };

  const statusParam = (req.query.status as string) || "";
  if (["initial", "approved", "rejected"].includes(statusParam)) {
    find.status = statusParam;
  }

  const sortParam = (req.query.sort as string) || "newest";
  const sortDirection = sortParam === "oldest" ? "asc" : "desc";

  const limitItems = PAGINATION.USER_APPLICATION_PAGE_SIZE ?? 10;
  let page = 1;
  if (req.query.page) {
    page = parseInt(`${req.query.page}`);
  }

  const totalRecord = await Application.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItems) || 1;
  const skip = (page - 1) * limitItems;

  const applications = await Application.find(find).sort({ createdAt: sortDirection }).limit(limitItems).skip(skip);

  const dataFinal: any[] = [];

  for (const app of applications) {
    const job = await Job.findById(app.jobId);
    const company = job ? await AccountCompany.findById(job.companyId) : null;

    dataFinal.push({
      id: app.id,
      status: app.status,
      viewedByCompany: app.viewedByCompany,
      jobId: app.jobId,
      jobTitle: job?.title ?? "",
      companyName: company?.companyName ?? "",
      createdAt: app.createdAt,
    });
  }

  return {
    code: "success",
    message: "Lấy danh sách đơn ứng tuyển thành công!",
    applications: dataFinal,
    totalPage,
  };
};

export const userDetail = async (req: AccountRequest) => {
  const userId = req.account.id;
  const id = req.params.id;

  const app = await Application.findOne({ _id: id, userId });
  if (!app) {
    return { code: "error", message: "Không tìm thấy đơn ứng tuyển!" };
  }

  const job = await Job.findById(app.jobId);
  const company = job ? await AccountCompany.findById(job.companyId) : null;
  const cv = await CV.findById(app.cvId);

  return {
    code: "success",
    message: "Thành công!",
    application: app,
    job,
    company,
    cv,
  };
};

export const companyList = async (req: AccountRequest) => {
  const companyId = req.account.id;
  const find: any = { companyId };

  const statusParam = (req.query.status as string) || "";
  if (["initial", "approved", "rejected"].includes(statusParam)) {
    find.status = statusParam;
  }

  const jobIdParam = (req.query.jobId as string) || "";
  if (jobIdParam) {
    find.jobId = jobIdParam;
  }

  const sortParam = (req.query.sort as string) || "newest";
  const sortDirection = sortParam === "oldest" ? "asc" : "desc";

  const limitItems = PAGINATION.COMPANY_APPLICATION_PAGE_SIZE ?? 10;
  let page = 1;
  if (req.query.page) {
    page = parseInt(`${req.query.page}`);
  }

  const totalRecord = await Application.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItems) || 1;
  const skip = (page - 1) * limitItems;

  const applications = await Application.find(find).sort({ createdAt: sortDirection }).limit(limitItems).skip(skip);

  const dataFinal: any[] = [];

  for (const app of applications) {
    const job = await Job.findById(app.jobId);
    const cv = await CV.findById(app.cvId);

    dataFinal.push({
      id: app.id,
      status: app.status,
      viewedByCompany: app.viewedByCompany,
      jobId: app.jobId,
      jobTitle: job?.title ?? "",
      candidateEmail: cv?.email ?? "",
      candidateName: cv?.userName ?? "",
      candidatePhone: cv?.phone ?? "",
      createdAt: app.createdAt,
    });
  }

  return {
    code: "success",
    message: "Lấy danh sách đơn ứng tuyển thành công!",
    applications: dataFinal,
    totalPage,
  };
};

export const companyDetail = async (req: AccountRequest) => {
  const companyId = req.account.id;
  const id = req.params.id;

  const app = await Application.findOne({ _id: id, companyId });
  if (!app) {
    return { code: "error", message: "Không tìm thấy đơn ứng tuyển!" };
  }

  const job = await Job.findById(app.jobId);
  const cv = await CV.findById(app.cvId);

  if (!app.viewedByCompany) {
    app.viewedByCompany = true;
    await app.save();
  }

  return {
    code: "success",
    message: "Thành công!",
    application: app,
    job,
    cv,
  };
};

export const companyChangeStatus = async (req: AccountRequest) => {
  const companyId = req.account.id;
  const id = req.params.id;
  const { status, notes } = req.body as { status: string; notes?: string };

  const app = await Application.findOne({ _id: id, companyId });
  if (!app) {
    return { code: "error", message: "Không tìm thấy đơn ứng tuyển!" };
  }

  app.status = status;
  await app.save();

  return { code: "success", message: "Cập nhật trạng thái thành công!" };
};
