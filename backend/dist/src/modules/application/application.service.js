"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeByUser = exports.companyChangeStatus = exports.companyDetail = exports.companyList = exports.userDetail = exports.userList = exports.apply = void 0;
const mongoose_1 = __importDefault(require("mongoose")); // ADDED
const application_model_1 = __importDefault(require("./application.model"));
const job_model_1 = __importDefault(require("../job/job.model"));
const company_model_1 = __importDefault(require("../company/company.model"));
const cv_model_1 = __importDefault(require("../cv/cv.model"));
const variable_config_1 = require("../../configs/variable.config");
const notification_model_1 = __importDefault(require("../notificaion/notification.model"));
const mail_helper_1 = require("../../utils/mail.helper"); // ADDED
const apply = async (req) => {
    const userId = req.account.id;
    const { jobId, cvId, email, userName, phone } = req.body;
    // FIXED: Validate job existence and lifecycle
    const job = await job_model_1.default.findById(jobId);
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
    const existingApplication = await application_model_1.default.findOne({ userId, jobId });
    if (existingApplication) {
        return {
            code: "error",
            message: "Bạn đã ứng tuyển công việc này rồi!",
        };
    }
    const session = await mongoose_1.default.startSession(); // ADDED: transaction session
    try {
        let application = null;
        await session.withTransaction(async () => {
            let finalCvId = cvId;
            if (!finalCvId) {
                if (!userName || !phone) {
                    // FIXED: Use user info, email optional
                    throw new Error("MISSING_CV_INFO");
                }
                const filePath = req.file ? req.file.path : req.body.fileCV || "";
                const [cv] = await cv_model_1.default.create([
                    {
                        userId, // FIXED: CV ownership by userId
                        jobId,
                        email,
                        userName,
                        phone,
                        fileCV: filePath,
                    },
                ], { session });
                finalCvId = cv._id.toString();
            }
            else {
                // FIXED: Validate CV ownership using userId instead of email
                const cv = await cv_model_1.default.findOne({ _id: finalCvId, userId }).session(session);
                if (!cv) {
                    throw new Error("CV_OWNERSHIP_INVALID");
                }
            }
            const now = new Date();
            const [createdApp] = await application_model_1.default.create([
                {
                    userId,
                    companyId,
                    jobId,
                    cvId: finalCvId,
                    status: "pending",
                    history: [
                        {
                            status: "pending",
                            updatedAt: now,
                        },
                    ],
                },
            ], { session });
            application = createdApp;
            await notification_model_1.default.create([
                {
                    receiverId: companyId,
                    receiverType: "company",
                    title: "Đơn ứng tuyển mới",
                    message: `Bạn có đơn ứng tuyển mới cho công việc "${job.title}"`,
                    data: {
                        applicationId: createdApp._id.toString(),
                        jobId,
                        cvId: finalCvId,
                    },
                },
            ], { session });
        });
        return {
            code: "success",
            message: "Đã gửi đơn ứng tuyển thành công!",
        };
    }
    catch (error) {
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
    }
    finally {
        session.endSession();
    }
};
exports.apply = apply;
const userList = async (req) => {
    const userId = req.account.id;
    const find = { userId };
    const statusParam = req.query.status || "";
    const allowedStatuses = ["pending", "viewed", "rejected", "accepted"]; // UPDATED
    if (allowedStatuses.includes(statusParam)) {
        // FIXED: use new status values
        find.status = statusParam;
    }
    const sortParam = req.query.sort || "newest";
    const sortDirection = sortParam === "oldest" ? "asc" : "desc";
    const limitItems = variable_config_1.PAGINATION.USER_APPLICATION_PAGE_SIZE ?? 10;
    let page = 1;
    if (req.query.page) {
        page = parseInt(`${req.query.page}`);
    }
    const totalRecord = await application_model_1.default.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limitItems) || 1;
    const skip = (page - 1) * limitItems;
    const applications = await application_model_1.default.find(find).sort({ createdAt: sortDirection }).limit(limitItems).skip(skip);
    // FIXED: N+1 query -> batch load jobs and companies
    const jobIds = Array.from(new Set(applications.map((app) => `${app.jobId}`)));
    const jobs = await job_model_1.default.find({ _id: { $in: jobIds } });
    const jobMap = new Map(jobs.map((job) => [job._id.toString(), job]));
    const companyIds = Array.from(new Set(jobs.map((job) => `${job.companyId}`))).filter(Boolean);
    const companies = await company_model_1.default.find({ _id: { $in: companyIds } });
    const companyMap = new Map(companies.map((company) => [company._id.toString(), company]));
    const dataFinal = applications.map((app) => {
        const job = jobMap.get(`${app.jobId}`);
        const company = job ? companyMap.get(`${job.companyId}`) : null;
        return {
            id: app.id,
            status: app.status,
            viewedByCompany: app.viewedByCompany,
            jobId: app.jobId,
            jobTitle: job?.title ?? "",
            companyName: company?.companyName ?? "",
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
exports.userList = userList;
const userDetail = async (req) => {
    const userId = req.account.id;
    const id = req.params.id;
    const app = await application_model_1.default.findOne({ _id: id, userId });
    if (!app) {
        return { code: "error", message: "Không tìm thấy đơn ứng tuyển!" };
    }
    const job = await job_model_1.default.findById(app.jobId);
    const company = job ? await company_model_1.default.findById(job.companyId) : null;
    const cv = await cv_model_1.default.findById(app.cvId);
    return {
        code: "success",
        message: "Thành công!",
        application: app,
        job,
        company,
        cv,
    };
};
exports.userDetail = userDetail;
const companyList = async (req) => {
    const companyId = req.account.id;
    const find = { companyId };
    const statusParam = req.query.status || "";
    const allowedStatuses = ["pending", "viewed", "rejected", "accepted"]; // UPDATED
    if (allowedStatuses.includes(statusParam)) {
        // FIXED: use new status values
        find.status = statusParam;
    }
    const jobIdParam = req.query.jobId || "";
    if (jobIdParam) {
        find.jobId = jobIdParam;
    }
    const sortParam = req.query.sort || "newest";
    const sortDirection = sortParam === "oldest" ? "asc" : "desc";
    const limitItems = variable_config_1.PAGINATION.COMPANY_APPLICATION_PAGE_SIZE ?? 10;
    let page = 1;
    if (req.query.page) {
        page = parseInt(`${req.query.page}`);
    }
    const totalRecord = await application_model_1.default.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limitItems) || 1;
    const skip = (page - 1) * limitItems;
    const applications = await application_model_1.default.find(find).sort({ createdAt: sortDirection }).limit(limitItems).skip(skip);
    // FIXED: N+1 query -> batch load jobs and CVs
    const jobIds = Array.from(new Set(applications.map((app) => `${app.jobId}`)));
    const cvIds = Array.from(new Set(applications.map((app) => `${app.cvId}`)));
    const jobs = await job_model_1.default.find({ _id: { $in: jobIds } });
    const jobMap = new Map(jobs.map((job) => [job._id.toString(), job]));
    const cvs = await cv_model_1.default.find({ _id: { $in: cvIds } });
    const cvMap = new Map(cvs.map((cv) => [cv._id.toString(), cv]));
    const dataFinal = applications.map((app) => {
        const job = jobMap.get(`${app.jobId}`);
        const cv = cvMap.get(`${app.cvId}`);
        return {
            id: app.id,
            status: app.status,
            viewedByCompany: app.viewedByCompany,
            jobId: app.jobId,
            jobTitle: job?.title ?? "",
            candidateEmail: cv?.email ?? "",
            candidateName: cv?.userName ?? "",
            candidatePhone: cv?.phone ?? "",
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
exports.companyList = companyList;
const companyDetail = async (req) => {
    const companyId = req.account.id;
    const id = req.params.id;
    const app = await application_model_1.default.findOne({ _id: id, companyId });
    if (!app) {
        return { code: "error", message: "Không tìm thấy đơn ứng tuyển!" };
    }
    const job = await job_model_1.default.findById(app.jobId);
    const cv = await cv_model_1.default.findById(app.cvId);
    if (!app.viewedByCompany) {
        app.viewedByCompany = true;
        if (app.status === "pending") {
            app.status = "viewed";
            app.history = app.history || [];
            app.history.push({ status: "viewed", updatedAt: new Date() });
        }
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
exports.companyDetail = companyDetail;
const companyChangeStatus = async (req) => {
    const companyId = req.account.id;
    const id = req.params.id;
    const { status, notes } = req.body;
    const app = await application_model_1.default.findOne({ _id: id, companyId });
    if (!app) {
        return { code: "error", message: "Không tìm thấy đơn ứng tuyển!" };
    }
    const allowedStatuses = ["accepted", "rejected"];
    if (!allowedStatuses.includes(status)) {
        return { code: "error", message: "Trạng thái không hợp lệ!" };
    }
    if (app.status === "accepted" && status === "accepted") {
        return { code: "error", message: "Đơn ứng tuyển này đã được chấp nhận trước đó!" };
    }
    const job = await job_model_1.default.findOne({ _id: app.jobId, companyId });
    if (!job) {
        return { code: "error", message: "Công việc không hợp lệ cho tài khoản này!" };
    }
    const cv = await cv_model_1.default.findById(app.cvId);
    if (!cv || `${cv.userId}` !== `${app.userId}`) {
        return { code: "error", message: "CV không hợp lệ cho đơn ứng tuyển này!" };
    }
    if (status === "accepted") {
        const existingAccepted = await application_model_1.default.findOne({ jobId: app.jobId, status: "accepted" });
        if (existingAccepted && existingAccepted._id.toString() !== app._id.toString()) {
            return { code: "error", message: "Công việc này đã có ứng viên được chấp nhận!" };
        }
    }
    app.status = status;
    app.history = app.history || [];
    app.history.push({ status, updatedAt: new Date() });
    await app.save();
    if (status === "accepted") {
        try {
            job.status = "closed";
            await job.save();
            await notification_model_1.default.create({
                receiverId: app.userId || "",
                receiverType: "user",
                title: "Đơn ứng tuyển đã được chấp nhận",
                message: `Đơn ứng tuyển của bạn cho công việc ${job.title} đã được chấp nhận.`,
                data: {
                    applicationId: app._id.toString(),
                    jobId: app.jobId,
                    cvId: app.cvId,
                },
            });
            if (cv.email) {
                const emailContent = `<p>Đơn ứng tuyển của bạn đã được chấp nhận.</p>`;
                await (0, mail_helper_1.sendMail)(cv.email, "Đơn ứng tuyển của bạn đã được chấp nhận", emailContent);
            }
        }
        catch { }
    }
    else if (status === "rejected") {
        try {
            await notification_model_1.default.create({
                receiverId: app.userId || "",
                receiverType: "user",
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
                await (0, mail_helper_1.sendMail)(cv.email, "Đơn ứng tuyển của bạn đã bị từ chối", emailContent);
            }
        }
        catch { }
    }
    return { code: "success", message: "Cập nhật trạng thái đơn ứng tuyển thành công!" };
};
exports.companyChangeStatus = companyChangeStatus;
// User: xóa đơn ứng tuyển (chỉ khi đã bị từ chối)
const removeByUser = async (req) => {
    const userId = req.account.id;
    const id = req.params.id;
    const application = await application_model_1.default.findOne({ _id: id, userId });
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
        const otherCount = await application_model_1.default.countDocuments({ cvId: application.cvId, _id: { $ne: application._id } });
        if (otherCount === 0) {
            await cv_model_1.default.deleteOne({ _id: application.cvId });
        }
    }
    await application_model_1.default.deleteOne({ _id: id, userId });
    return {
        code: "success",
        message: "Đã xóa đơn ứng tuyển!",
    };
};
exports.removeByUser = removeByUser;
