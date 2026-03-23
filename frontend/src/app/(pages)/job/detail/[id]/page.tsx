"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
/* eslint-disable @next/next/no-img-element */
import { positionList, workingFormList } from "@/configs/variable";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowRight, FaBriefcase, FaLocationDot, FaUserTie } from "react-icons/fa6";
import { FormApply } from "./FormApply";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = params.id as string;

  const { isLogin, infoUser } = useAuth();
  const router = useRouter();

  const [jobDetail, setJobDetail] = useState<any | null>(null);
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/detail/${id}`);
      const data = await res.json();

      if (data.code === "success") {
        const detail = data.jobDetail;
        detail.position = positionList.find((pos) => pos.value === detail.position)?.label;
        detail.workingForm = workingFormList.find((work) => work.value === detail.workingForm)?.label;
        setJobDetail(detail);
      }
    };

    fetchJobDetail();
  }, [id]);
  return (
    <>
      <Toaster richColors position="top-right" />
      {jobDetail && (
        <div className="pt-[30px] pb-[60px]">
          <div className="contain">
            <div className="flex gap-[20px] lg:flex-nowrap flex-wrap relative ">
              {/* Left */}
              <div className="lg:w-[65%] w-[100%] z-10">
                {/* Thông tin công việc */}
                <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
                  <h1 className="font-[700] sm:text-[28px] text-[24px] text-[#121212] mb-[10px]"> {jobDetail.title}</h1>
                  <div className="font-[400] text-[16px] text-[#414042] mb-[10px]"> {jobDetail.companyName}</div>
                  <div className="font-[700] text-[20px] text-primary sm:mb-[20px] mb-[10px]">
                    {jobDetail.salaryMin.toLocaleString("vi-VN")} - {jobDetail.salaryMax.toLocaleString("vi-VN")}tr
                  </div>
                  <button
                    type="button"
                    onClick={() => (isLogin ? setShowApplyForm(true) : toast.error("Vui lòng đăng nhập để ứng tuyển!"))}
                    className="flex items-center justify-center w-full h-[48px] bg-primary rounded-[4px] font-[700] text-[16px] text-white"
                  >
                    Ứng tuyển
                  </button>
                  <div className="grid grid-cols-3 sm:gap-[16px] gap-[8px] mb-[20px]">
                    {jobDetail.images.map((image: any, index: number) => (
                      <img key={index} src={image} alt={`Hình ảnh ${index + 1}`} className="w-[100%] aspect-[232/145] rounded-[4px] object-contain border border-[#DEDEDE] p-1" />
                    ))}
                  </div>
                </div>
                {/* Hết Thông tin công việc */}
                {/* Mô tả chi tiết */}
                <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
                  <div dangerouslySetInnerHTML={{ __html: jobDetail.description }} />
                </div>
                {/* Hết Mô tả chi tiết */}
              </div>
              {/* Right */}
              <div className="flex-1 z-10">
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
                      <div className="font-[400] text-[16px] text-[#A6A6A6]">Quy mô công ty</div>
                      <div className="font-[400] text-[16px] text-[#121212]"> {jobDetail.companyEmployees}</div>
                    </div>
                    <div className="flex justify-between gap-[5px] flex-wrap">
                      <div className="font-[400] text-[16px] text-[#A6A6A6]">Thời gian làm việc</div>
                      <div className="font-[400] text-[16px] text-[#121212]"> {jobDetail.companyWorkingTime}</div>
                    </div>
                    <div className="flex justify-between gap-[5px] flex-wrap">
                      <div className="font-[400] text-[16px] text-[#A6A6A6]">Địa chỉ</div>
                      <div className="font-[400] text-[16px] text-[#121212]">{jobDetail.companyAddress}</div>
                    </div>
                  </div>
                </div>
              </div>
              {showApplyForm && (
                <div className="bg-black/50 fixed top-0 left-0 bottom-0 right-0 z-50" id="boxApplyForm">
                  <div className="min-w-[200px] w-[50%] mx-auto mt-[120px] bg-white rounded-[8px] p-[20px] relative z-50">
                    <h2 className="font-[700] text-[18px] text-[#121212] mb-[12px]">Nộp hồ sơ ứng tuyển</h2>
                    <FormApply jobId={jobDetail.id} />
                  </div>
                  <div onClick={showApplyForm ? () => setShowApplyForm(false) : undefined} className="absolute top-0 left-0 bottom-0 right-0 z-0"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
