import Job from "./job.model";
import AccountCompany from "../company/company.model";

export const detail = async (id: string) => {
  const record = await Job.findOne({ _id: id });

  if (!record) {
    return {
      code: "error",
      message: "Thất bại!",
    };
  }

  const jobDetail: any = {
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
    companyModel: "",
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
