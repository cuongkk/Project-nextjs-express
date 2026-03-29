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

  const handlePagination = (value: number) => {
    setPage(value);
  };

  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          <div className="flex items-center justify-end mb-[20px]">
            <button
              type="button"
              onClick={() => router.push(`/search${searchParams.toString() ? `?${searchParams.toString()}` : ""}`)}
              className="border border-primary text-primary rounded-[4px] px-[16px] py-[8px] text-[14px] font-[500]"
            >
              Tìm kiếm nâng cao
            </button>
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
