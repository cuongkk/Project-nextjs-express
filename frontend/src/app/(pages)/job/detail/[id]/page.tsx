/* eslint-disable @typescript-eslint/no-explicit-any */
import { positionList, workingFormList } from "@/configs/variable";
import Link from "next/link";
import { FaArrowRight, FaBriefcase, FaLocationDot, FaUserTie } from "react-icons/fa6";
import { FormApply } from "./FormApply";

/* eslint-disable @next/next/no-img-element */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/detail/${id}`);
  const data = await res.json();

  let jobDetail: any = null;

  if (data.code == "success") {
    jobDetail = data.jobDetail;
    jobDetail.position = positionList.find((pos) => pos.value === jobDetail.position)?.label;
    jobDetail.workingForm = workingFormList.find((work) => work.value === jobDetail.workingForm)?.label;
  }
  return (
    <>
      {jobDetail && (
        <div className="pt-[30px] pb-[60px]">
          <div className="contain">
            <div className="flex gap-[20px] lg:flex-nowrap flex-wrap">
              {/* Left */}
              <div className="lg:w-[65%] w-[100%]">
                {/* Thông tin công việc */}
                <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
                  <h1 className="font-[700] sm:text-[28px] text-[24px] text-[#121212] mb-[10px]"> {jobDetail.title}</h1>
                  <div className="font-[400] text-[16px] text-[#414042] mb-[10px]"> {jobDetail.companyName}</div>
                  <div className="font-[700] text-[20px] text-primary sm:mb-[20px] mb-[10px]">
                    {" "}
                    {jobDetail.salaryMin.toLocaleString("vi-VN")}$ - {jobDetail.salaryMax.toLocaleString("vi-VN")}$
                  </div>
                  <Link href="boxApplyForm" className="flex items-center justify-center h-[48px] bg-primary rounded-[4px] font-[700] text-[16px] text-white mb-[20px]">
                    Ứng tuyển
                  </Link>
                  <div className="grid grid-cols-3 sm:gap-[16px] gap-[8px] mb-[20px]">
                    {jobDetail.images.map((image: any, index: number) => (
                      <img key={index} src={image} alt={`Hình ảnh ${index + 1}`} className="w-[100%] aspect-[232/145] rounded-[4px] object-contain border border-[#DEDEDE] p-1" />
                    ))}
                  </div>
                  <div className="flex gap-x-[8px] font-[400] text-[14px] text-[#121212] mb-[10px]">
                    <FaUserTie className="text-[16px]" /> {jobDetail.position}
                  </div>
                  <div className="flex gap-x-[8px] font-[400] text-[14px] text-[#121212] mb-[10px]">
                    <FaBriefcase className="text-[16px]" /> {jobDetail.workingForm}
                  </div>
                  <div className="flex gap-x-[8px] font-[400] text-[14px] text-[#121212] mb-[10px]">
                    <FaLocationDot className="text-[16px]" /> {jobDetail.companyAddress}
                  </div>
                  <div className="flex gap-[8px] flex-wrap">
                    {jobDetail.technologies.map((tech: any, index: number) => (
                      <span key={index} className="rounded-[20px] border border-[#DEDEDE] py-[6px] px-[16px] font-[400] text-[12px] text-[#414042]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Hết Thông tin công việc */}
                {/* Mô tả chi tiết */}
                <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
                  <div dangerouslySetInnerHTML={{ __html: jobDetail.description }} />
                </div>
                {/* Hết Mô tả chi tiết */}
                {/* Form ứng tuyển */}
                <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]" id="boxApplyForm">
                  <h2 className="font-[700] text-[20px] text-black mb-[20px]">Ứng tuyển ngay</h2>
                  <FormApply jobId={id} />
                </div>
                {/* Hết Form ứng tuyển */}
              </div>
              {/* Right */}
              <div className="flex-1">
                <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
                  <div className="flex items-start gap-x-[12px]">
                    <img src={jobDetail.companyLogo} alt={jobDetail.companyName} className="w-[100px] aspect-square rounded-[4px] object-cover" />
                    <div className="flex-1">
                      <div className="font-[700] text-[18px] text-[#121212] mb-[10px]">{jobDetail.companyName}</div>
                      <Link href={`/company/detail/${jobDetail.companyId}`} className="flex gap-x-[8px] items-center font-[400] text-[16px] text-primary">
                        Xem công ty <FaArrowRight className="text-[16px]" />
                      </Link>
                    </div>
                  </div>
                  <div className="mt-[20px] flex flex-col gap-[10px]">
                    <div className="flex justify-between gap-[5px] flex-wrap">
                      <div className="font-[400] text-[16px] text-[#A6A6A6]">Mô hình công ty</div>
                      <div className="font-[400] text-[16px] text-[#121212]"> {jobDetail.companyModel}</div>
                    </div>
                    <div className="flex justify-between gap-[5px] flex-wrap">
                      <div className="font-[400] text-[16px] text-[#A6A6A6]">Quy mô công ty</div>
                      <div className="font-[400] text-[16px] text-[#121212]"> {jobDetail.companyEmployees}</div>
                    </div>
                    <div className="flex justify-between gap-[5px] flex-wrap">
                      <div className="font-[400] text-[16px] text-[#A6A6A6]">Thời gian làm việc</div>
                      <div className="font-[400] text-[16px] text-[#121212]"> {jobDetail.companyWorkingTime}</div>
                    </div>
                    <div className="flex justify-between gap-[5px] flex-wrap">
                      <div className="font-[400] text-[16px] text-[#A6A6A6]">Làm việc ngoài giờ</div>
                      <div className="font-[400] text-[16px] text-[#121212]">{jobDetail.companyWorkOvertime}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
