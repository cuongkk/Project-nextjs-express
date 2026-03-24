import { AccountRequest } from "../../interfaces/request.interface";
import Application from "./application.model";
import Job from "../job/job.model";
import AccountCompany from "../company/company.model";
import CV from "../cv/cv.model";
import { PAGINATION } from "../../configs/variable.config";

export const userList = async (req: AccountRequest) => {
  const userId = req.account.id;

  const find = { userId };

  const limitItems = PAGINATION.USER_APPLICATION_PAGE_SIZE ?? 10;
  let page = 1;
  if (req.query.page) {
    page = parseInt(`${req.query.page}`);
  }

  const totalRecord = await Application.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItems) || 1;
  const skip = (page - 1) * limitItems;

  const applications = await Application.find(find).sort({ createdAt: "desc" }).limit(limitItems).skip(skip);

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

  const find = { companyId };

  const limitItems = PAGINATION.COMPANY_APPLICATION_PAGE_SIZE ?? 10;
  let page = 1;
  if (req.query.page) {
    page = parseInt(`${req.query.page}`);
  }

  const totalRecord = await Application.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItems) || 1;
  const skip = (page - 1) * limitItems;

  const applications = await Application.find(find).sort({ createdAt: "desc" }).limit(limitItems).skip(skip);

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
  const { id, status, notes } = req.body as { id: string; status: string; notes?: string };

  const app = await Application.findOne({ _id: id, companyId });
  if (!app) {
    return { code: "error", message: "Không tìm thấy đơn ứng tuyển!" };
  }

  app.status = status;
  if (notes !== undefined) {
    app.notes = notes;
  }
  await app.save();

  return { code: "success", message: "Cập nhật trạng thái thành công!" };
};
