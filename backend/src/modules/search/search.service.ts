import Job from "../job/job.model";
import AccountCompany from "../company/company.model";
import City from "../city/city.model";
import { PAGINATION } from "../../configs/variable.config";

export const search = async (query: any) => {
  const dataFinal: any[] = [];
  let totalRecord = 0;
  let totalPage = 1;

  const find: any = {};

  if (query.language || query.technologies) {
    const tech = query.language || query.technologies;
    find.technologies = tech;
  }

  if (query.city) {
    const city = await City.findOne({
      name: query.city,
    });

    if (city) {
      const listAccountCompanyInCity = await AccountCompany.find({
        city: city.id,
      });

      find.companyId = {
        $in: listAccountCompanyInCity.map((item) => item.id),
      };
    }
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
    find.position = query.position;
  }

  if (query.workingForm) {
    find.workingForm = query.workingForm;
  }

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
      workingForm: item.workingForm,
      companyCity: "",
      technologies: item.technologies,
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
