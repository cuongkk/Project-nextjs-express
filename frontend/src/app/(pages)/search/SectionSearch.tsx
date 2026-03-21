/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { JobItem } from "@/app/components/card/JobItem";
import { positionList, workingFormList } from "@/configs/variable";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const SectionSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const language = searchParams.get("language") || "";
  const city = searchParams.get("city") || "";
  const company = searchParams.get("company") || "";
  const keyword = searchParams.get("keyword") || "";
  const position = searchParams.get("position") || "";
  const workingForm = searchParams.get("workingForm") || "";
  const [jobList, setJobList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?language=${language}&city=${city}&company=${company}&keyword=${keyword}&position=${position}&workingForm=${workingForm}&page=${page}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          setJobList(data.jobs);
          setTotalPage(data.totalPage);
          setTotalRecord(data.totalRecord);
        }
      });
  }, [language, city, company, keyword, position, workingForm, page]);

  const handleFilterPosition = (event: any) => {
    const value = event.target.value;

    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("position", value);
    } else {
      params.delete("position");
    }

    router.push(`/search?${params.toString()}`);
  };

  const handleFilterWorkingForm = (event: any) => {
    const value = event.target.value;

    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("workingForm", value);
    } else {
      params.delete("workingForm");
    }

    router.push(`/search?${params.toString()}`);
  };

  const handlePagination = (event: any) => {
    const value = parseInt(event.target.value);
    setPage(value);
  };

  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          <h2 className="mb-[30px] font-[700] text-[28px] text-[#121212]">
            {totalRecord} việc làm
            <span className="text-primary ml-[5px]">
              {language} {city} {company} {keyword}
            </span>
          </h2>
          <div className="py-[10px] px-[20px] rounded-[8px] flex flex-wrap gap-[12px] mb-[30px]" style={{ boxShadow: "0px 4px 20px 0px #0000000F" }}>
            <select className="h-[36px] border-[1px] border-[#DEDEDE] rounded-[20px] px-[18px] font-[400] text-[16px] text-[#414042]" onChange={handleFilterPosition} defaultValue={position}>
              {positionList.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <select className="h-[36px] border-[1px] border-[#DEDEDE] rounded-[20px] px-[18px] font-[400] text-[16px] text-[#414042]" onChange={handleFilterWorkingForm} defaultValue={workingForm}>
              {workingFormList.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
            {jobList.map((item) => (
              <JobItem key={item.id} item={item} />
            ))}
          </div>
          <div className="mt-[30px]">
            <select className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]" onChange={handlePagination}>
              {Array(totalPage)
                .fill("")
                .map((item, index) => (
                  <option value={index + 1} key={index}>
                    Trang {index + 1}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
};
