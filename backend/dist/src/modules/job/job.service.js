"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.detail = exports.list = exports.all = void 0;
const job_model_1 = __importDefault(require("./job.model"));
const city_model_1 = __importDefault(require("../city/city.model"));
const company_model_1 = __importDefault(require("../company/company.model"));
const application_model_1 = __importDefault(require("../application/application.model"));
const cv_model_1 = __importDefault(require("../cv/cv.model"));
const variable_config_1 = require("../../configs/variable.config");
const all = async () => {
    const [totalJobs, cities, title, techArrays, companyIds] = await Promise.all([
        job_model_1.default.countDocuments(),
        job_model_1.default.find().distinct("city"),
        job_model_1.default.find().distinct("title"),
        job_model_1.default.find().distinct("technologies"),
        job_model_1.default.find().distinct("companyId"),
    ]);
    const [listCity, companies] = await Promise.all([city_model_1.default.find({ _id: { $in: cities } }), company_model_1.default.find({ _id: { $in: companyIds } }).select("_id companyName")]);
    const techList = Array.from(new Set(techArrays.flat()));
    return {
        code: "success",
        total: totalJobs,
        listCity: listCity,
        title: title,
        techList: techList,
        companies: companies,
    };
};
exports.all = all;
const list = async (companyId) => {
    const limitItems = variable_config_1.PAGINATION.JOB_LIST_PAGE_SIZE ?? 10;
    const jobs = await job_model_1.default.find({ companyId }).sort({ createdAt: "desc" }).limit(limitItems);
    const company = await company_model_1.default.findById(companyId);
    const city = await city_model_1.default.findById(company?.city);
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
exports.list = list;
const detail = async (id) => {
    const record = await job_model_1.default.findOne({ _id: id });
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
    const jobDetail = {
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
    const accountCompany = await company_model_1.default.findOne({
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
exports.detail = detail;
const create = async (req) => {
    req.body.companyId = req.account.id;
    req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
    req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
    req.body.technologies = req.body.technologies || [];
    req.body.images = [];
    // Thiết lập thời hạn job nếu chưa có
    if (!req.body.expiresAt) {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + variable_config_1.JOB_EXPIRE_DAYS * 24 * 60 * 60 * 1000);
        req.body.expiresAt = expiresAt;
    }
    if (req.files) {
        for (const file of req.files) {
            req.body.images.push(file.path);
        }
    }
    const newRecord = new job_model_1.default(req.body);
    await newRecord.save();
    return {
        code: "success",
        message: "Tạo công việc thành công!",
    };
};
exports.create = create;
const update = async (req) => {
    const id = req.params.id;
    const jobDetail = await job_model_1.default.findOne({
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
    if (req.files && req.files.length > 0) {
        req.body.images = [];
        for (const file of req.files) {
            req.body.images.push(file.path);
        }
    }
    await job_model_1.default.updateOne({
        _id: id,
        companyId: req.account.id,
    }, req.body);
    return {
        code: "success",
        message: "Cập nhật thành công!",
    };
};
exports.update = update;
const remove = async (req) => {
    const id = req.params.id;
    const jobDetail = await job_model_1.default.findOne({
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
    await application_model_1.default.deleteMany({ jobId: id });
    // Xóa tất cả CV liên quan đến job này (CV tạo ra khi ứng tuyển)
    await cv_model_1.default.deleteMany({ jobId: id });
    await job_model_1.default.deleteOne({
        _id: id,
        companyId: req.account.id,
    });
    return {
        code: "success",
        message: "Đã xóa công việc!",
    };
};
exports.remove = remove;
