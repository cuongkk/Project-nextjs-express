"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detail = exports.list = exports.deleteJobDel = exports.editJobPatch = exports.editJob = exports.listJob = exports.createJobPost = exports.profilePatch = void 0;
const company_model_1 = __importDefault(require("./company.model"));
const job_model_1 = __importDefault(require("../job/job.model"));
const city_model_1 = __importDefault(require("../city/city.model"));
const application_model_1 = __importDefault(require("../application/application.model"));
const cv_model_1 = __importDefault(require("../cv/cv.model"));
const variable_config_1 = require("../../configs/variable.config");
const profilePatch = async (req) => {
    if (req.file) {
        req.body.logo = req.file.path;
    }
    else {
        delete req.body.logo;
    }
    await company_model_1.default.updateOne({
        _id: req.account.id,
    }, req.body);
    return {
        code: "success",
        message: "Cập nhật thành công!",
    };
};
exports.profilePatch = profilePatch;
const createJobPost = async (req) => {
    req.body.companyId = req.account.id;
    req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
    req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
    req.body.technologies = req.body.technologies ? req.body.technologies.split(", ") : [];
    req.body.images = [];
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
exports.createJobPost = createJobPost;
const listJob = async (req) => {
    const find = {
        companyId: req.account.id,
    };
    const limitItems = variable_config_1.PAGINATION.COMPANY_JOB_PAGE_SIZE;
    let page = 1;
    if (req.query.page) {
        page = parseInt(`${req.query.page}`);
    }
    const totalRecord = await job_model_1.default.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limitItems);
    const skip = (page - 1) * limitItems;
    const jobs = await job_model_1.default.find(find)
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
    return {
        code: "success",
        message: "Lấy danh sách công việc thành công!",
        jobs: dataFinal,
        totalPage: totalPage,
    };
};
exports.listJob = listJob;
const editJob = async (req) => {
    const id = req.params.id;
    const jobDetail = await job_model_1.default.findOne({
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
exports.editJob = editJob;
const editJobPatch = async (req) => {
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
    req.body.technologies = req.body.technologies ? req.body.technologies.split(", ") : [];
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
exports.editJobPatch = editJobPatch;
const deleteJobDel = async (req) => {
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
    const now = new Date();
    const isExpiredByTime = !!jobDetail.expiresAt && jobDetail.expiresAt < now;
    if (!isExpiredByTime) {
        return {
            code: "error",
            message: "Chỉ có thể xóa công việc sau khi đã hết hạn!",
        };
    }
    await application_model_1.default.deleteMany({ jobId: id });
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
exports.deleteJobDel = deleteJobDel;
const list = async (req) => {
    const find = {};
    let limitItems = variable_config_1.PAGINATION.COMPANY_LIST_PAGE_SIZE;
    if (req.query.limitItems) {
        limitItems = parseInt(`${req.query.limitItems}`);
    }
    let page = 1;
    if (req.query.page) {
        page = parseInt(`${req.query.page}`);
    }
    const totalRecord = await company_model_1.default.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limitItems);
    const skip = (page - 1) * limitItems;
    // 1. Lấy company
    const companyList = await company_model_1.default.find(find).sort({ createdAt: -1 }).limit(limitItems).skip(skip);
    // 2. Lấy tất cả city liên quan
    const cityIds = companyList.map((c) => c.city);
    const cities = await city_model_1.default.find({ _id: { $in: cityIds } });
    const cityMap = new Map();
    cities.forEach((c) => {
        cityMap.set(c._id.toString(), c.name);
    });
    // 3. Group job count
    const now = new Date();
    const jobCounts = await job_model_1.default.aggregate([
        {
            $match: {
                companyId: { $in: companyList.map((c) => c.id) },
                status: "active",
                $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gte: now } }],
            },
        },
        {
            $group: {
                _id: "$companyId",
                total: { $sum: 1 },
            },
        },
    ]);
    const jobMap = new Map();
    jobCounts.forEach((j) => {
        jobMap.set(j._id.toString(), j.total);
    });
    // 4. Build result
    const companyListFinal = companyList.map((item) => ({
        id: item.id,
        logo: item.logo,
        companyName: item.companyName,
        cityName: cityMap.get(item.city?.toString()) || "",
        totalJob: jobMap.get(item.id.toString()) || 0,
    }));
    return {
        code: "success",
        message: "Thành công!",
        companyList: companyListFinal,
        totalPage: totalPage,
    };
};
exports.list = list;
const detail = async (req) => {
    const id = req.params.id;
    const record = await company_model_1.default.findOne({
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
    const jobs = await job_model_1.default.find({
        companyId: id,
        status: "active",
        $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gte: new Date() } }],
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
        const city = await city_model_1.default.findOne({
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
exports.detail = detail;
