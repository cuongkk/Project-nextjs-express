import Job from "./job.model";
import City from "../city/city.model";
import AccountCompany from "../company/company.model";
import Application from "../application/application.model";
import CV from "../cv/cv.model";
import CandidateProfile from "../profile/candidate-profile.model";
import { AccountRequest } from "../../interfaces/request.interface";
import { JOB_EXPIRE_DAYS, PAGINATION } from "../../configs/variable.config";

const normalizeType = (record: any) => {
  return record.type || (record.workingForm === "remote" ? "remote" : record.workingForm === "part-time" ? "hybrid" : "onsite");
};

const normalizeLevel = (record: any) => {
  return record.level || record.position || "junior";
};

const normalizeTechStack = (record: any): string[] => {
  if (Array.isArray(record.techStack) && record.techStack.length) return record.techStack;
  if (Array.isArray(record.technologies)) return record.technologies;
  return [];
};

const normalizeStatus = (status?: string) => {
  if (status === "active") return "open";
  return status || "open";
};

const mapJobCard = (item: any, company?: any, cityName?: string) => ({
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

const sanitizeStatusForQuery = (status?: string) => {
  if (!status) return undefined;
  if (status === "open" || status === "active") return { $in: ["open", "active"] };
  if (["closed", "expired"].includes(status)) return status;
  return undefined;
};

const normalizeText = (value?: string) => `${value || ""}`.trim().toLowerCase();

const getLevelBucket = (level: string) => {
  const normalized = normalizeText(level);
  if (["intern"].includes(normalized)) return "intern";
  if (["junior", "fresher"].includes(normalized)) return "junior";
  if (["middle", "mid", "senior", "manager"].includes(normalized)) return normalized === "junior" ? "junior" : normalized === "middle" || normalized === "mid" ? "middle" : "senior";
  return normalized || "junior";
};

const isExperienceFit = (experienceYears: number, jobLevel: string) => {
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

export const all = async () => {
  const [totalJobs, cities, title, levels, types, techArrays, companyIds] = await Promise.all([
    Job.countDocuments(),
    Job.find().distinct("city"),
    Job.find().distinct("title"),
    Job.find().distinct("level"),
    Job.find().distinct("type"),
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
    positions: levels.filter(Boolean),
    levels: levels.filter(Boolean),
    types: types.filter(Boolean),
    techList: techList,
    companies: companies,
  };
};

export const publicList = async (query: any) => {
  const find: any = {};
  const andConditions: any[] = [];

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

    const cityByName = await City.findOne({ name: location });
    if (cityByName) {
      const listAccountCompanyInCity = await AccountCompany.find({ city: cityByName.id }).select("_id");
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

  const statusFind = sanitizeStatusForQuery(query.status as string);
  if (statusFind) {
    find.status = statusFind;
  } else {
    find.status = { $in: ["open", "active"] };
  }

  const salaryMin = query.salaryMin ? Number(query.salaryMin) : undefined;
  const salaryMax = query.salaryMax ? Number(query.salaryMax) : undefined;
  if (!Number.isNaN(salaryMin) && !Number.isNaN(salaryMax) && salaryMin !== undefined && salaryMax !== undefined) {
    find.salaryMin = { $lte: salaryMax };
    find.salaryMax = { $gte: salaryMin };
  } else if (!Number.isNaN(salaryMin) && salaryMin !== undefined) {
    find.salaryMax = { $gte: salaryMin };
  } else if (!Number.isNaN(salaryMax) && salaryMax !== undefined) {
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

  const limitItems = query.limit ? Math.max(1, Number(query.limit)) : PAGINATION.SEARCH_JOB_PAGE_SIZE;
  const page = query.page ? Math.max(1, Number(query.page)) : 1;

  const totalRecord = await Job.countDocuments(find);
  const totalPage = Math.max(1, Math.ceil(totalRecord / limitItems));
  const skip = (page - 1) * limitItems;

  const jobs = await Job.find(find).sort({ createdAt: "desc" }).limit(limitItems).skip(skip);

  const companyIds = Array.from(new Set(jobs.map((item) => `${item.companyId}`))).filter(Boolean);
  const companies = await AccountCompany.find({ _id: { $in: companyIds } }).select("_id companyName logo city");
  const companyMap = new Map(companies.map((company) => [company.id, company]));

  const cityIds = Array.from(new Set(companies.map((item: any) => `${item.city}`))).filter(Boolean);
  const cities = await City.find({ _id: { $in: cityIds } }).select("_id name");
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

export const list = async (companyId: string) => {
  const jobs = await Job.find({ companyId }).sort({ createdAt: "desc" });

  const company = await AccountCompany.findById(companyId);

  const city = await City.findById(company?.city);
  const dataFinal = jobs.map((item) => mapJobCard(item, company, `${city?.name || ""}`));

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

  if (isExpiredByTime || (isInactiveStatus && normalizeStatus(record.status) !== "open")) {
    return {
      code: "error",
      message: "Công việc đã hết hạn hoặc không còn tuyển dụng!",
    };
  }

  const jobDetail: any = {
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

  const company = await AccountCompany.findById(req.account.id).select("companyName");
  if (company) {
    req.body.companyName = company.companyName;
  }

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
  req.body.techStack = req.body.techStack || req.body.technologies || jobDetail.techStack || jobDetail.technologies || [];
  req.body.technologies = req.body.techStack;
  req.body.type = req.body.type || req.body.workingForm || jobDetail.type || "onsite";
  req.body.level = req.body.level || req.body.position || jobDetail.level || "junior";
  req.body.location = req.body.location || req.body.city || jobDetail.location || "";
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

export const recommend = async (req: AccountRequest) => {
  const userId = req.account?.id;
  if (!userId) return { code: "error", message: "Unauthorized" };

  const limitRaw = req.query.limit ? Number(req.query.limit) : 12;
  const limit = Number.isFinite(limitRaw) ? Math.min(20, Math.max(1, limitRaw)) : 12;

  const profile = await CandidateProfile.findOne({ userId }).lean();
  if (!profile) {
    return { code: "success", message: "OK", jobs: [] };
  }

  const rawSkills = (Array.isArray(profile.skills) ? profile.skills : []).map((s) => `${s}`.trim()).filter(Boolean);
  const uniqueSkillMap = new Map<string, string>();
  for (const skill of rawSkills) {
    const key = normalizeText(skill);
    if (!key || uniqueSkillMap.has(key)) continue;
    uniqueSkillMap.set(key, skill);
  }
  const skills = Array.from(uniqueSkillMap.values());
  const location = normalizeText(profile.location);
  const experienceYears = typeof profile.experienceYears === "number" ? profile.experienceYears : Number(profile.experienceYears) || 0;

  const now = new Date();
  const jobs = await Job.find({
    status: { $in: ["open", "active"] },
    $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gte: now } }],
  })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  const companyIds = Array.from(new Set(jobs.map((j: any) => `${j.companyId}`))).filter(Boolean);
  const companies = await AccountCompany.find({ _id: { $in: companyIds } }).select("_id companyName logo city").lean();
  const companyMap = new Map(companies.map((c: any) => [`${c._id}`, c]));

  const cityIds = Array.from(new Set(companies.map((c: any) => `${c.city}`))).filter(Boolean);
  const cities = await City.find({ _id: { $in: cityIds } }).select("_id name").lean();
  const cityMap = new Map(cities.map((c: any) => [`${c._id}`, c.name]));

  const scored = jobs
    .map((job: any) => {
      const techStack = normalizeTechStack(job);
      const techSet = new Set(techStack.map((t) => normalizeText(t)));
      const matchedSkills = skills.filter((s) => techSet.has(normalizeText(s)));

      let score = 0;
      score += matchedSkills.length;

      const jobLocation = normalizeText(job.location || "");
      if (location && jobLocation && location === jobLocation) score += 1;

      const level = normalizeLevel(job);
      const expMatch = isExperienceFit(experienceYears, level);
      if (expMatch) score += 1;

      const reasons: string[] = [];
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
