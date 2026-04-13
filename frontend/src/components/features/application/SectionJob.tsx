/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { JobItem } from "@/components/features/job/JobItem";
import { positionList, workingFormList } from "@/configs/variable";
import { Pagination } from "@/components/ui/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const SectionJob = () => {
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

  const handlePagination = (value: number) => {
    setPage(value);
  };

  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          <div className="flex items-center justify-between mb-[20px] lg:flex-row flex-col-reverse gap-[12px]">
            <div className="w-full flex flex-col gap-[4px] ">
              <h2 className="font-[700] sm:text-[24px] text-[20px] text-[#121212] mb-[4px]">Việc làm nổi bật</h2>
              <p className="text-[14px] text-[#6B6B6B]">Khám phá những việc làm hàng đầu trên ITJobs.</p>
            </div>
            <div className="w-full align-self-start flex justify-end">
              <button
                type="button"
                onClick={() => router.push(`/search${searchParams.toString() ? `?${searchParams.toString()}` : ""}`)}
                className=" flex text-end border border-primary text-primary rounded-[4px] px-[16px] py-[8px] text-[14px] font-[500]"
              >
                Tìm kiếm nâng cao
              </button>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[20px]">
            {jobList.map((item) => (
              <JobItem key={item.id} item={item} />
            ))}
          </div>
          <Pagination totalPage={totalPage} page={page} onChange={handlePagination} />
        </div>
      </div>
    </>
  );
};
