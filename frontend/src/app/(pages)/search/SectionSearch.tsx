/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { JobItem } from "@/app/components/card/JobItem";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const SectionSearch = () => {
  const searchParams = useSearchParams();
  const language = searchParams.get("language") || "";
  const [jobList, setJobList] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?language=${language}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          setJobList(data.jobs);
        }
      });
  }, [language]);

  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          <h2 className="mb-[30px] font-[700] text-[28px] text-[#121212]">
            76 việc làm
            <span className="text-primary ml-[5px]">{language}</span>
          </h2>
          <div className="py-[10px] px-[20px] rounded-[8px] flex flex-wrap gap-[12px] mb-[30px]" style={{ boxShadow: "0px 4px 20px 0px #0000000F" }}>
            <select className="h-[36px] border-[1px] border-[#DEDEDE] rounded-[20px] px-[18px] font-[400] text-[16px] text-[#414042]">
              <option value="">Cấp bậc</option>
              <option value="">Intern</option>
              <option value="">Fresher</option>
              <option value="">Junior</option>
              <option value="">Middle</option>
              <option value="">Senior</option>
              <option value="">Manager</option>
            </select>
            <select className="h-[36px] border-[1px] border-[#DEDEDE] rounded-[20px] px-[18px] font-[400] text-[16px] text-[#414042]">
              <option value="">Hình thức làm việc</option>
              <option value="">Tại văn phòng</option>
              <option value="">Làm từ xa</option>
              <option value="">Linh hoạt</option>
            </select>
          </div>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
            {jobList.map((item) => (
              <JobItem key={item.id} item={item} />
            ))}
          </div>
          <div className="mt-[30px]">
            <select className="border border-[#DEDEDE] rounded-[8px] h-[44px] px-[18px] font-[400] text-[16px] text-[#414042]">
              <option value="">Trang 1</option>
              <option value="">Trang 2</option>
              <option value="">Trang 3</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};
