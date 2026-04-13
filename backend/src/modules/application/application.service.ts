import mongoose from "mongoose"; // ADDED
import { AccountRequest } from "../../interfaces/request.interface";
import Application from "./application.model";
import Job from "../job/job.model";
import AccountCompany from "../company/company.model";
import CV from "../cv/cv.model";
import { PAGINATION } from "../../configs/variable.config";
import Notification from "../notificaion/notification.model";
import Conversation from "../chat/conversation.model";
import { sendMail } from "../../utils/mail.helper"; // ADDED

const PIPELINE_STATUSES = ["applied", "screening", "interview", "offer", "hired", "rejected"] as const;

const normalizeStatus = (status?: string) => {
  if (!status) return "applied";
  if (status === "pending") return "applied";
  if (status === "viewed") return "screening";
  if (status === "accepted") return "hired";
  return status;
};

const canTransition = (from: string, to: string) => {
  const graph: Record<string, string[]> = {
    applied: ["screening", "rejected"],
    screening: ["interview", "offer", "rejected"],
    interview: ["offer", "rejected"],
    offer: ["hired", "rejected"],
    hired: [],
    rejected: [],
  };

  if (from === to) return false;
  return (graph[from] || []).includes(to);
};

export const apply = async (req: AccountRequest & { file?: any }) => {
  const userId = req.account.id;
  const { jobId, cvId, email, userName, phone } = req.body as {
    jobId: string;
    cvId?: string;
    email?: string; // ADDED: still stored but NOT used for ownership
    userName?: string;
    phone?: string;
  };

  // FIXED: Validate job existence and lifecycle
  const job = await Job.findById(jobId);
  if (!job) {
    return { code: "error", message: "Công việc không tồn tại!" };
  }

  if (job.status && job.status !== "active") {
    // FIXED: Prevent applying to non-active job
    return { code: "error", message: "Công việc đã đóng hoặc hết hạn!" };
  }

  if (job.expiresAt && job.expiresAt < new Date()) {
    // FIXED: Prevent applying to expired job
    return { code: "error", message: "Công việc đã hết hạn!" };
  }

  const companyId = job.companyId ? `${job.companyId}` : "";
  if (!companyId) {
    return { code: "error", message: "Công việc không hợp lệ!" };
  }

  // FIXED: Prevent duplicate application per user/job
  const existingApplication = await Application.findOne({ userId, jobId });
  if (existingApplication) {
    return {
      code: "error",
      message: "Bạn đã ứng tuyển công việc này rồi!",
    };
  }

  const session = await mongoose.startSession(); // ADDED: transaction session

  try {
    let application: any = null;

    await session.withTransaction(async () => {
      let finalCvId = cvId;

      if (!finalCvId) {
        if (!userName || !phone) {
          // FIXED: Use user info, email optional
          throw new Error("MISSING_CV_INFO");
        }

        const filePath = (req as any).file ? (req as any).file.path : (req.body as any).fileCV || "";

        const [cv] = await CV.create(
          [
            {
              userId, // FIXED: CV ownership by userId
              jobId,
              email,
              userName,
              phone,
              fileCV: filePath,
            },
          ],
          { session },
        );

        finalCvId = cv._id.toString();
      } else {
        // FIXED: Validate CV ownership using userId instead of email
        const cv = await CV.findOne({ _id: finalCvId, userId }).session(session);
        if (!cv) {
          throw new Error("CV_OWNERSHIP_INVALID");
        }
      }

      const now = new Date();
      const resumeUrl = finalCvId ? `${(await CV.findById(finalCvId).session(session))?.fileCV || ""}` : "";

      const [createdApp] = await Application.create(
        [
          {
            userId,
            candidateId: userId,
            companyId,
            jobId,
            cvId: finalCvId,
            resumeUrl,
            status: "applied",
            history: [
              {
                status: "applied",
                updatedAt: now,
              },
            ],
          },
        ],
        { session },
      );

      application = createdApp;

      await Notification.create(
        [
          {
            receiverId: companyId,
            receiverType: "company",
            type: "NEW_APPLICATION",
            title: "Đơn ứng tuyển mới",
            message: `Bạn có đơn ứng tuyển mới cho công việc "${job.title}"`,
            data: {
              applicationId: createdApp._id.toString(),
              jobId,
              cvId: finalCvId,
            },
          },
        ],
        { session },
      );

      // ADDED: Create BoxContact conversation (1 job context)
      const participants = [userId, companyId].map((x) => `${x}`).sort();
      const existingConv = await Conversation.findOne({
        jobId,
        participants: { $all: participants },
        $expr: { $eq: [{ $size: "$participants" }, 2] },
      }).session(session);
      if (!existingConv) {
        await Conversation.create(
          [
            {
              jobId,
              participants,
              lastMessage: "",
              lastMessageAt: null,
            },
          ],
          { session },
        );
      }
    });

    return {
      code: "success",
      message: "Đã gửi đơn ứng tuyển thành công!",
    };
  } catch (error: any) {
    // FIXED: Map known error cases
    if (error?.message === "MISSING_CV_INFO") {
      return { code: "error", message: "Thiếu thông tin CV để ứng tuyển!" };
    }
    if (error?.message === "CV_OWNERSHIP_INVALID") {
      return { code: "error", message: "CV không hợp lệ hoặc không thuộc về tài khoản hiện tại!" };
    }
    if (error?.code === 11000) {
      // ADDED: unique index violation safety net
      return { code: "error", message: "Bạn đã ứng tuyển công việc này rồi!" };
    }
    return { code: "error", message: "Gửi đơn ứng tuyển thất bại!" };
  } finally {
    session.endSession();
  }
};

export const userList = async (req: AccountRequest) => {
  const userId = req.account.id;
  const find: any = { userId };

  const statusParam = (req.query.status as string) || "";
  const allowedStatuses = [...PIPELINE_STATUSES, "pending", "viewed", "accepted"];
  if (allowedStatuses.includes(statusParam)) {
    if (statusParam === "applied") {
      find.status = { $in: ["applied", "pending"] };
    } else if (statusParam === "screening") {
      find.status = { $in: ["screening", "viewed"] };
    } else if (statusParam === "hired") {
      find.status = { $in: ["hired", "accepted"] };
    } else {
      find.status = statusParam;
    }
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

  // FIXED: N+1 query -> batch load jobs and companies
  const jobIds = Array.from(new Set(applications.map((app) => `${app.jobId}`)));
  const jobs = await Job.find({ _id: { $in: jobIds } });
  const jobMap = new Map(jobs.map((job) => [job._id.toString(), job]));

  const companyIds = Array.from(new Set(jobs.map((job) => `${job.companyId}`))).filter(Boolean);
  const companies = await AccountCompany.find({ _id: { $in: companyIds } });
  const companyMap = new Map(companies.map((company) => [company._id.toString(), company]));

  const dataFinal: any[] = applications.map((app) => {
    const job = jobMap.get(`${app.jobId}`) as any;
    const company = job ? (companyMap.get(`${job.companyId}`) as any) : null;

    return {
      id: app.id,
      status: normalizeStatus(app.status),
      viewedByCompany: app.viewedByCompany,
      jobId: app.jobId,
      jobTitle: job?.title ?? "",
      companyName: company?.companyName ?? "",
      companyId: job?.companyId ?? "",
      createdAt: app.createdAt,
    };
  });

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
    application: {
      ...app.toObject(),
      status: normalizeStatus(app.status),
    },
    job,
    company,
    cv,
  };
};

export const companyList = async (req: AccountRequest) => {
  const companyId = req.account.id;
  const find: any = { companyId };

  const statusParam = (req.query.status as string) || "";
  const allowedStatuses = [...PIPELINE_STATUSES, "pending", "viewed", "accepted"];
  if (allowedStatuses.includes(statusParam)) {
    if (statusParam === "applied") {
      find.status = { $in: ["applied", "pending"] };
    } else if (statusParam === "screening") {
      find.status = { $in: ["screening", "viewed"] };
    } else if (statusParam === "hired") {
      find.status = { $in: ["hired", "accepted"] };
    } else {
      find.status = statusParam;
    }
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

  // FIXED: N+1 query -> batch load jobs and CVs
  const jobIds = Array.from(new Set(applications.map((app) => `${app.jobId}`)));
  const cvIds = Array.from(new Set(applications.map((app) => `${app.cvId}`)));

  const jobs = await Job.find({ _id: { $in: jobIds } });
  const jobMap = new Map(jobs.map((job) => [job._id.toString(), job]));

  const cvs = await CV.find({ _id: { $in: cvIds } });
  const cvMap = new Map(cvs.map((cv) => [cv._id.toString(), cv]));

  const dataFinal: any[] = applications.map((app) => {
    const job = jobMap.get(`${app.jobId}`) as any;
    const cv = cvMap.get(`${app.cvId}`) as any;

    return {
      id: app.id,
      status: normalizeStatus(app.status),
      viewedByCompany: app.viewedByCompany,
      jobId: app.jobId,
      jobTitle: job?.title ?? "",
      candidateEmail: cv?.email ?? "",
      candidateName: cv?.userName ?? "",
      candidatePhone: cv?.phone ?? "",
      userId: app.userId ?? "",
      createdAt: app.createdAt,
    };
  });

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
    if (normalizeStatus(app.status) === "applied") {
      app.status = "screening" as any;
      app.history = app.history || [];
      app.history.push({ status: "screening", updatedAt: new Date() });
    }
    await app.save();
  }

  return {
    code: "success",
    message: "Thành công!",
    application: {
      ...app.toObject(),
      status: normalizeStatus(app.status),
    },
    job,
    cv,
  };
};

export const companyChangeStatus = async (req: AccountRequest) => {
  const companyId = req.account.id;
  const id = req.params.id;
  const { status, notes, note, interviewDate } = req.body as { status: string; notes?: string; note?: string; interviewDate?: string };

  const app = await Application.findOne({ _id: id, companyId });
  if (!app) {
    return { code: "error", message: "Không tìm thấy đơn ứng tuyển!" };
  }

  const nextStatus = normalizeStatus(status);
  const currentStatus = normalizeStatus(app.status);

  if (!PIPELINE_STATUSES.includes(nextStatus as any)) {
    return { code: "error", message: "Trạng thái không hợp lệ!" };
  }

  if (!canTransition(currentStatus, nextStatus)) {
    return { code: "error", message: `Không thể chuyển trạng thái từ ${currentStatus} sang ${nextStatus}!` };
  }

  const job = await Job.findOne({ _id: app.jobId, companyId });
  if (!job) {
    return { code: "error", message: "Công việc không hợp lệ cho tài khoản này!" };
  }

  const cv = await CV.findById(app.cvId);
  if (!cv || `${cv.userId}` !== `${app.userId}`) {
    return { code: "error", message: "CV không hợp lệ cho đơn ứng tuyển này!" };
  }

  if (nextStatus === "hired") {
    const existingAccepted = await Application.findOne({ jobId: app.jobId, status: { $in: ["hired", "accepted"] } });
    if (existingAccepted && existingAccepted._id.toString() !== app._id.toString()) {
      return { code: "error", message: "Công việc này đã có ứng viên được chấp nhận!" };
    }
  }

  if (nextStatus === "interview") {
    if (!interviewDate) {
      return { code: "error", message: "Vui lòng chọn lịch phỏng vấn!" };
    }
    app.interviewDate = new Date(interviewDate);
  }

  if (note || notes) {
    app.note = `${note || notes}`;
  }

  app.status = nextStatus as any;
  app.history = app.history || [];
  app.history.push({ status: nextStatus, updatedAt: new Date(), note: `${note || notes || ""}` });
  await app.save();

  if (nextStatus === "hired") {
    try {
      job.status = "closed";
      await job.save();

      await Notification.create({
        receiverId: app.userId || "",
        receiverType: "user",
        type: "application_status",
        title: "Đơn ứng tuyển đã được chấp nhận",
        message: `Đơn ứng tuyển của bạn cho công việc ${job.title} đã được tuyển dụng.`,
        data: {
          applicationId: app._id.toString(),
          jobId: app.jobId,
          cvId: app.cvId,
        },
      });

      if (cv.email) {
        const emailContent = `<p>Đơn ứng tuyển của bạn đã chuyển sang trạng thái <b>Hired</b>.</p>`;
        await sendMail(cv.email, "Đơn ứng tuyển của bạn đã trúng tuyển", emailContent);
      }
    } catch {}
  } else if (nextStatus === "rejected") {
    try {
      await Notification.create({
        receiverId: app.userId || "",
        receiverType: "user",
        type: "application_status",
        title: "Đơn ứng tuyển đã bị từ chối",
        message: `Đơn ứng tuyển của bạn cho công việc ${job.title} đã bị từ chối.`,
        data: {
          applicationId: app._id.toString(),
          jobId: app.jobId,
          cvId: app.cvId,
        },
      });

      if (cv.email) {
        const emailContent = `<p>Đơn ứng tuyển của bạn đã bị từ chối.</p>`;
        await sendMail(cv.email, "Đơn ứng tuyển của bạn đã bị từ chối", emailContent);
      }
    } catch {}
  } else if (nextStatus === "interview" && cv.email) {
    try {
      await sendMail(cv.email, "Lịch phỏng vấn", `<p>Bạn đã được mời phỏng vấn cho công việc ${job.title}. Thời gian: <b>${new Date(app.interviewDate as Date).toLocaleString("vi-VN")}</b></p>`);
    } catch {}
  }

  return { code: "success", message: "Cập nhật trạng thái đơn ứng tuyển thành công!" };
};

export const companySetInterviewDate = async (req: AccountRequest) => {
  const companyId = req.account.id;
  const id = req.params.id;
  const { interviewDate, note } = req.body as { interviewDate?: string; note?: string };

  if (!interviewDate) {
    return { code: "error", message: "Vui lòng chọn lịch phỏng vấn!" };
  }

  req.body.status = "interview";
  req.body.interviewDate = interviewDate;
  if (note) req.body.note = note;

  const app = await Application.findOne({ _id: id, companyId });
  if (!app) {
    return { code: "error", message: "Không tìm thấy đơn ứng tuyển!" };
  }

  return companyChangeStatus(req);
};

// User: xóa đơn ứng tuyển (chỉ khi đã bị từ chối)
export const removeByUser = async (req: AccountRequest) => {
  const userId = req.account.id;
  const id = req.params.id;

  const application = await Application.findOne({ _id: id, userId });

  if (!application) {
    return {
      code: "error",
      message: "Không tìm thấy đơn ứng tuyển!",
    };
  }

  if (application.status !== "rejected") {
    return {
      code: "error",
      message: "Chỉ có thể xóa đơn ứng tuyển khi đã bị từ chối!",
    };
  }

  // Nếu CV chỉ được dùng cho duy nhất đơn này thì xóa luôn CV
  if (application.cvId) {
    const otherCount = await Application.countDocuments({ cvId: application.cvId, _id: { $ne: application._id } });
    if (otherCount === 0) {
      await CV.deleteOne({ _id: application.cvId });
    }
  }

  await Application.deleteOne({ _id: id, userId });

  return {
    code: "success",
    message: "Đã xóa đơn ứng tuyển!",
  };
};
