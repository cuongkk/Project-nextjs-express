"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommend = exports.remove = exports.update = exports.create = exports.detail = exports.list = exports.publicList = exports.all = void 0;
const job_model_1 = __importDefault(require("./job.model"));
const city_model_1 = __importDefault(require("../city/city.model"));
const company_model_1 = __importDefault(require("../company/company.model"));
const application_model_1 = __importDefault(require("../application/application.model"));
const cv_model_1 = __importDefault(require("../cv/cv.model"));
const candidate_profile_model_1 = __importDefault(require("../profile/candidate-profile.model"));
const variable_config_1 = require("../../configs/variable.config");
const normalizeType = (record) => {
    return record.type || (record.workingForm === "remote" ? "remote" : record.workingForm === "part-time" ? "hybrid" : "onsite");
};
const normalizeLevel = (record) => {
    return record.level || record.position || "junior";
};
const normalizeTechStack = (record) => {
    if (Array.isArray(record.techStack) && record.techStack.length)
        return record.techStack;
    if (Array.isArray(record.technologies))
        return record.technologies;
    return [];
};
const normalizeStatus = (status) => {
    if (status === "active")
        return "open";
    return status || "open";
};
const mapJobCard = (item, company, cityName) => ({
    id: item._id,
    title: item.title,
    companyName: item.companyName || company?.companyName || "",
    location: item.location || cityName || "",
    salaryMin: item.salaryMin || 0,
    salaryMax: item.salaryMax || 0,
    type: normalizeType(item),
    level: normalizeLevel(item),
    techStack: normalizeTechStack(item),
    description: item.description || "",
    requirements: item.requirements || "",
    benefits: item.benefits || "",
    status: normalizeStatus(item.status),
    expiresAt: item.expiresAt,
    companyLogo: company?.logo || "",
    createdBy: item.createdBy || item.companyId,
    position: item.position,
    workingForm: item.workingForm,
    technologies: normalizeTechStack(item),
    companyCity: cityName || "",
});
const sanitizeStatusForQuery = (status) => {
    if (!status)
        return undefined;
    if (status === "open" || status === "active")
        return { $in: ["open", "active"] };
    if (["closed", "expired"].includes(status))
        return status;
    return undefined;
};
const normalizeText = (value) => `${value || ""}`.trim().toLowerCase();
const getLevelBucket = (level) => {
    const normalized = normalizeText(level);
    if (["intern"].includes(normalized))
        return "intern";
    if (["junior", "fresher"].includes(normalized))
        return "junior";
    if (["middle", "mid", "senior", "manager"].includes(normalized))
        return normalized === "junior" ? "junior" : normalized === "middle" || normalized === "mid" ? "middle" : "senior";
    return normalized || "junior";
};
const isExperienceFit = (experienceYears, jobLevel) => {
    const levelBucket = getLevelBucket(jobLevel);
    const exp = Number.isFinite(experienceYears) ? experienceYears : 0;
    if (levelBucket === "intern" || levelBucket === "junior") {
        return exp >= 0 && exp <= 1;
    }
    if (levelBucket === "middle") {
        return exp > 1 && exp <= 3;
    }
    // senior/manager/others: treat >=3 years as fit
    return exp >= 3;
};
const all = async () => {
    const [totalJobs, cities, title, levels, types, techArrays, companyIds] = await Promise.all([
        job_model_1.default.countDocuments(),
        job_model_1.default.find().distinct("city"),
        job_model_1.default.find().distinct("title"),
        job_model_1.default.find().distinct("level"),
        job_model_1.default.find().distinct("type"),
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
        positions: levels.filter(Boolean),
        levels: levels.filter(Boolean),
        types: types.filter(Boolean),
        techList: techList,
        companies: companies,
    };
};
exports.all = all;
const publicList = async (query) => {
    const find = {};
    const andConditions = [];
    if (query.keyword) {
        andConditions.push({
            $or: [
                { title: new RegExp(`${query.keyword}`, "i") },
                { description: new RegExp(`${query.keyword}`, "i") },
                { requirements: new RegExp(`${query.keyword}`, "i") },
                { companyName: new RegExp(`${query.keyword}`, "i") },
                { location: new RegExp(`${query.keyword}`, "i") },
            ],
        });
    }
    if (query.location || query.city) {
        const location = `${query.location || query.city}`;
        andConditions.push({ location: new RegExp(`${location}`, "i") });
        const cityByName = await city_model_1.default.findOne({ name: location });
        if (cityByName) {
            const listAccountCompanyInCity = await company_model_1.default.find({ city: cityByName.id }).select("_id");
            find.companyId = { $in: listAccountCompanyInCity.map((item) => item.id) };
        }
    }
    const type = query.type || query.workingForm;
    if (type) {
        andConditions.push({ $or: [{ type }, { workingForm: type }] });
    }
    const level = query.level || query.position;
    if (level) {
        andConditions.push({ $or: [{ level }, { position: level }] });
    }
    if (query.companyName || query.company) {
        find.companyName = new RegExp(`${query.companyName || query.company}`, "i");
    }
    const statusFind = sanitizeStatusForQuery(query.status);
    if (statusFind) {
        find.status = statusFind;
    }
    else {
        find.status = { $in: ["open", "active"] };
    }
    const salaryMin = query.salaryMin ? Number(query.salaryMin) : undefined;
    const salaryMax = query.salaryMax ? Number(query.salaryMax) : undefined;
    if (!Number.isNaN(salaryMin) && !Number.isNaN(salaryMax) && salaryMin !== undefined && salaryMax !== undefined) {
        find.salaryMin = { $lte: salaryMax };
        find.salaryMax = { $gte: salaryMin };
    }
    else if (!Number.isNaN(salaryMin) && salaryMin !== undefined) {
        find.salaryMax = { $gte: salaryMin };
    }
    else if (!Number.isNaN(salaryMax) && salaryMax !== undefined) {
        find.salaryMin = { $lte: salaryMax };
    }
    const techStack = query.techStack || query.technologies;
    if (techStack) {
        const listTech = Array.isArray(techStack) ? techStack : [`${techStack}`];
        andConditions.push({ $or: [{ techStack: { $in: listTech } }, { technologies: { $in: listTech } }] });
    }
    const now = new Date();
    andConditions.push({ $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gte: now } }] });
    if (andConditions.length > 0) {
        find.$and = andConditions;
    }
    const limitItems = query.limit ? Math.max(1, Number(query.limit)) : variable_config_1.PAGINATION.SEARCH_JOB_PAGE_SIZE;
    const page = query.page ? Math.max(1, Number(query.page)) : 1;
    const totalRecord = await job_model_1.default.countDocuments(find);
    const totalPage = Math.max(1, Math.ceil(totalRecord / limitItems));
    const skip = (page - 1) * limitItems;
    const jobs = await job_model_1.default.find(find).sort({ createdAt: "desc" }).limit(limitItems).skip(skip);
    const companyIds = Array.from(new Set(jobs.map((item) => `${item.companyId}`))).filter(Boolean);
    const companies = await company_model_1.default.find({ _id: { $in: companyIds } }).select("_id companyName logo city");
    const companyMap = new Map(companies.map((company) => [company.id, company]));
    const cityIds = Array.from(new Set(companies.map((item) => `${item.city}`))).filter(Boolean);
    const cities = await city_model_1.default.find({ _id: { $in: cityIds } }).select("_id name");
    const cityMap = new Map(cities.map((city) => [city.id, city.name]));
    const dataFinal = jobs.map((item) => {
        const company = companyMap.get(`${item.companyId}`);
        const cityName = company?.city ? cityMap.get(`${company.city}`) || "" : "";
        return mapJobCard(item, company, cityName);
    });
    return {
        code: "success",
        message: "Lấy danh sách công việc thành công!",
        jobs: dataFinal,
        totalPage,
        totalRecord,
        page,
    };
};
exports.publicList = publicList;
const list = async (companyId) => {
    const jobs = await job_model_1.default.find({ companyId }).sort({ createdAt: "desc" });
    const company = await company_model_1.default.findById(companyId);
    const city = await city_model_1.default.findById(company?.city);
    const dataFinal = jobs.map((item) => mapJobCard(item, company, `${city?.name || ""}`));
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
    if (isExpiredByTime || (isInactiveStatus && normalizeStatus(record.status) !== "open")) {
        return {
            code: "error",
            message: "Công việc đã hết hạn hoặc không còn tuyển dụng!",
        };
    }
    const jobDetail = {
        id: record.id,
        title: record.title,
        companyName: record.companyName || "",
        location: record.location || "",
        type: normalizeType(record),
        level: normalizeLevel(record),
        salaryMin: record.salaryMin,
        salaryMax: record.salaryMax,
        techStack: normalizeTechStack(record),
        images: record.images,
        position: record.position,
        workingForm: record.workingForm,
        companyAddress: "",
        technologies: normalizeTechStack(record),
        description: record.description,
        requirements: record.requirements,
        benefits: record.benefits,
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
    req.body.createdBy = req.account.id;
    req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
    req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
    req.body.techStack = req.body.techStack || req.body.technologies || [];
    req.body.technologies = req.body.techStack || [];
    req.body.type = req.body.type || req.body.workingForm || "onsite";
    req.body.level = req.body.level || req.body.position || "junior";
    req.body.location = req.body.location || req.body.city || "";
    req.body.status = req.body.status || "open";
    req.body.images = [];
    const company = await company_model_1.default.findById(req.account.id).select("companyName");
    if (company) {
        req.body.companyName = company.companyName;
    }
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
    req.body.techStack = req.body.techStack || req.body.technologies || jobDetail.techStack || jobDetail.technologies || [];
    req.body.technologies = req.body.techStack;
    req.body.type = req.body.type || req.body.workingForm || jobDetail.type || "onsite";
    req.body.level = req.body.level || req.body.position || jobDetail.level || "junior";
    req.body.location = req.body.location || req.body.city || jobDetail.location || "";
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
const recommend = async (req) => {
    const userId = req.account?.id;
    if (!userId)
        return { code: "error", message: "Unauthorized" };
    const limitRaw = req.query.limit ? Number(req.query.limit) : 12;
    const limit = Number.isFinite(limitRaw) ? Math.min(20, Math.max(1, limitRaw)) : 12;
    const profile = await candidate_profile_model_1.default.findOne({ userId }).lean();
    if (!profile) {
        return { code: "success", message: "OK", jobs: [] };
    }
    const rawSkills = (Array.isArray(profile.skills) ? profile.skills : []).map((s) => `${s}`.trim()).filter(Boolean);
    const uniqueSkillMap = new Map();
    for (const skill of rawSkills) {
        const key = normalizeText(skill);
        if (!key || uniqueSkillMap.has(key))
            continue;
        uniqueSkillMap.set(key, skill);
    }
    const skills = Array.from(uniqueSkillMap.values());
    const location = normalizeText(profile.location);
    const experienceYears = typeof profile.experienceYears === "number" ? profile.experienceYears : Number(profile.experienceYears) || 0;
    const now = new Date();
    const jobs = await job_model_1.default.find({
        status: { $in: ["open", "active"] },
        $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gte: now } }],
    })
        .sort({ createdAt: -1 })
        .limit(200)
        .lean();
    const companyIds = Array.from(new Set(jobs.map((j) => `${j.companyId}`))).filter(Boolean);
    const companies = await company_model_1.default.find({ _id: { $in: companyIds } }).select("_id companyName logo city").lean();
    const companyMap = new Map(companies.map((c) => [`${c._id}`, c]));
    const cityIds = Array.from(new Set(companies.map((c) => `${c.city}`))).filter(Boolean);
    const cities = await city_model_1.default.find({ _id: { $in: cityIds } }).select("_id name").lean();
    const cityMap = new Map(cities.map((c) => [`${c._id}`, c.name]));
    const scored = jobs
        .map((job) => {
        const techStack = normalizeTechStack(job);
        const techSet = new Set(techStack.map((t) => normalizeText(t)));
        const matchedSkills = skills.filter((s) => techSet.has(normalizeText(s)));
        let score = 0;
        score += matchedSkills.length;
        const jobLocation = normalizeText(job.location || "");
        if (location && jobLocation && location === jobLocation)
            score += 1;
        const level = normalizeLevel(job);
        const expMatch = isExperienceFit(experienceYears, level);
        if (expMatch)
            score += 1;
        const reasons = [];
        if (matchedSkills.length > 0) {
            reasons.push(`Matched skills: ${matchedSkills.join(", ")}`);
        }
        if (location && jobLocation && location === jobLocation) {
            reasons.push("Location match");
        }
        if (expMatch) {
            reasons.push("Experience level match");
        }
        const company = companyMap.get(`${job.companyId}`);
        const cityName = company?.city ? cityMap.get(`${company.city}`) || "" : "";
        return {
            ...mapJobCard(job, company, cityName),
            matchScore: score,
            matchedSkills,
            reasons,
        };
    })
        .filter((item) => item.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
    return {
        code: "success",
        message: "Lấy danh sách gợi ý thành công!",
        jobs: scored,
    };
};
exports.recommend = recommend;
