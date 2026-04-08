"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { JobItem } from "@/components/features/job/JobItem";
import { FaLocationDot } from "react-icons/fa6";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

/* eslint-disable @next/next/no-img-element */
export default function Page() {
  const params = useParams<{ id: string }>();
  const id = params.id as string;

  const [companyDetail, setCompanyDetail] = useState<any | null>(null);
  const [jobList, setJobList] = useState<any[]>([]);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${id}`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "error") {
          notFound();
        }
        setCompanyDetail(data.companyDetail);
        setJobList(Array.isArray(data.jobs) ? data.jobs : []);
      });
  }, [id]);

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
            <div dangerouslySetInnerHTML={{ __html: companyDetail?.description }} />
          </div>
          <div className="mt-[30px]">
            <h2 className="font-[700] text-[28px] text-[#121212] mb-[20px]">Công ty có {jobList.length} việc làm</h2>
            {jobList.length === 0 ? (
              <p className="text-[14px] text-[#6B6B6B]">Hiện tại công ty chưa có công việc nào đang tuyển dụng.</p>
            ) : (
              <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
                {jobList.map((item: any) => (
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
