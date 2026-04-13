import Job from "../job/job.model";
import AccountCompany from "../company/company.model";
import City from "../city/city.model";
import mongoose from "mongoose";
import { PAGINATION } from "../../configs/variable.config";

export const search = async (query: any) => {
  const dataFinal: any[] = [];
  let totalRecord = 0;
  let totalPage = 1;

  const find: any = {};

  if (query.language || query.technologies || query.techStack) {
    const tech = query.language || query.technologies || query.techStack;

    if (Array.isArray(tech)) {
      find.$or = [{ technologies: { $in: tech } }, { techStack: { $in: tech } }];
    } else {
      find.$or = [{ technologies: tech }, { techStack: tech }];
    }
  }

  if (query.city) {
    let cityId = String(query.city);

    // Hỗ trợ cả truyền city theo _id hoặc theo tên
    if (!mongoose.Types.ObjectId.isValid(cityId)) {
      const cityByName = await City.findOne({ name: cityId });
      if (cityByName) {
        cityId = cityByName.id;
      }
    }

    const listAccountCompanyInCity = await AccountCompany.find({
      city: cityId,
    });

    find.companyId = {
      $in: listAccountCompanyInCity.map((item) => item.id),
    };
  }

  if (query.company) {
    const accountCompany = await AccountCompany.findOne({
      companyName: query.company,
    });
    find.companyId = accountCompany?.id;
  }

  if (query.keyword) {
    const keywordRegex = new RegExp(`${query.keyword}`, "i");
    find.title = keywordRegex;
  }

  if (query.position) {
    find.$and = [...(find.$and || []), { $or: [{ position: query.position }, { level: query.position }] }];
  }

  if (query.workingForm || query.type) {
    const type = query.workingForm || query.type;
    find.$and = [...(find.$and || []), { $or: [{ workingForm: type }, { type }] }];
  }

  // Lọc theo khoảng lương nếu có
  const salaryMin = query.salaryMin ? Number(query.salaryMin) : undefined;
  const salaryMax = query.salaryMax ? Number(query.salaryMax) : undefined;

  if (!Number.isNaN(salaryMin) && !Number.isNaN(salaryMax) && salaryMin !== undefined && salaryMax !== undefined) {
    // Job có khoảng lương giao nhau với khoảng người dùng chọn
    find.salaryMin = { $lte: salaryMax };
    find.salaryMax = { $gte: salaryMin };
  } else if (!Number.isNaN(salaryMin) && salaryMin !== undefined) {
    find.salaryMax = { $gte: salaryMin };
  } else if (!Number.isNaN(salaryMax) && salaryMax !== undefined) {
    find.salaryMin = { $lte: salaryMax };
  }

  // Chỉ tìm các job còn hiệu lực (đang active và chưa hết hạn)
  const now = new Date();
  find.status = { $in: ["active", "open"] };
  find.$and = [...(find.$and || []), { $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gte: now } }] }];

  const limitItems = PAGINATION.SEARCH_JOB_PAGE_SIZE;
  let page = 1;
  if (query.page) {
    page = parseInt(`${query.page}`);
  }
  totalRecord = await Job.countDocuments(find);
  totalPage = Math.ceil(totalRecord / limitItems);
  const skip = (page - 1) * limitItems;

  const jobs = await Job.find(find)
    .sort({
      createdAt: "desc",
    })
    .limit(limitItems)
    .skip(skip);

  for (const item of jobs) {
    const itemFinal: any = {
      id: item.id,
      companyLogo: "",
      title: item.title,
      companyName: "",
      salaryMin: item.salaryMin,
      salaryMax: item.salaryMax,
      position: item.position,
      workingForm: item.workingForm || item.type,
      companyCity: "",
      technologies: (item.techStack as string[]) || (item.technologies as string[]) || [],
    };

    const companyInfo = await AccountCompany.findOne({
      _id: item.companyId,
    });
    if (companyInfo) {
      itemFinal.companyLogo = `${companyInfo.logo}`;
      itemFinal.companyName = `${companyInfo.companyName}`;

      const city = await City.findOne({
        _id: companyInfo.city,
      });
      itemFinal.companyCity = `${city?.name}`;
    }

    dataFinal.push(itemFinal);
  }

  return {
    code: "success",
    message: "Thành công!",
    jobs: dataFinal,
    totalPage,
    totalRecord,
  };
};
