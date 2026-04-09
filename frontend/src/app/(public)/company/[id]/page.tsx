import type { Metadata } from "next";
import { JobItem } from "@/components/features/job/JobItem";
import { FaLocationDot } from "react-icons/fa6";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Chi tiết công ty",
};

/* eslint-disable @next/next/no-img-element */
type CompanyPageParams = {
  id: string;
};

type CompanyResponse = {
  code?: string;
  companyDetail?: {
    companyName?: string;
    logo?: string;
    address?: string;
    companyEmployees?: string;
    workingTime?: string;
    description?: string;
  };
  jobs?: Array<{ id: string | number; [key: string]: unknown }>;
};

async function getCompanyData(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const response = await fetch(`${apiUrl}/companies/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch company detail. Status: ${response.status}`);
  }

  const data = (await response.json()) as CompanyResponse;

  if (data.code === "error" || !data.companyDetail) {
    notFound();
  }

  return {
    companyDetail: data.companyDetail,
    jobList: Array.isArray(data.jobs) ? data.jobs : [],
  };
}

export default async function Page({ params }: { params: Promise<CompanyPageParams> }) {
  const { id } = await params;
  const { companyDetail, jobList } = await getCompanyData(id);

  return (
    <>
      <div className="pt-[30px] pb-[60px]">
        <div className="contain">
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
            <div className="flex items-start gap-[16px] sm:flex-row flex-col">
              <img alt={companyDetail?.companyName} className="w-[100px] aspect-[1/1] rounded-[4px] object-contain" src={companyDetail?.logo} />
              <div className="flex-1">
                <div className="font-[700] text-[28px] text-[#121212] mb-[10px]">{companyDetail?.companyName}</div>
                <div className="flex gap-[8px] items-center font-[400] text-[14px] text-[#121212]">
                  <FaLocationDot className="text-[16px]" /> {companyDetail?.address}{" "}
                </div>
              </div>
            </div>
            <div className="mt-[20px] flex flex-col gap-[10px]">
              <div className="flex gap-[5px] flex-wrap">
                <div className="font-[400] text-[16px] text-[#A6A6A6]">Quy mô công ty:</div>
                <div className="font-[400] text-[16px] text-[#121212]"> {companyDetail?.companyEmployees}</div>
              </div>
              <div className="flex gap-[5px] flex-wrap">
                <div className="font-[400] text-[16px] text-[#A6A6A6]">Thời gian làm việc:</div>
                <div className="font-[400] text-[16px] text-[#121212]"> {companyDetail?.workingTime}</div>
              </div>
              <div className="flex gap-[5px] flex-wrap">
                <div className="font-[400] text-[16px] text-[#A6A6A6]">Địa chỉ:</div>
                <div className="font-[400] text-[16px] text-[#121212]"> {companyDetail?.address}</div>
              </div>
            </div>
          </div>
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
            {" "}
            <div dangerouslySetInnerHTML={{ __html: companyDetail?.description ?? "" }} />
          </div>
          <div className="mt-[30px]">
            <h2 className="font-[700] text-[28px] text-[#121212] mb-[20px]">Công ty có {jobList.length} việc làm</h2>
            {jobList.length === 0 ? (
              <p className="text-[14px] text-[#6B6B6B]">Hiện tại công ty chưa có công việc nào đang tuyển dụng.</p>
            ) : (
              <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
                {jobList.map((item) => (
                  <JobItem item={item} key={item.id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
