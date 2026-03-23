/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { cvStatusList, positionList, workingFormList } from "@/configs/variable";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBriefcase, FaCircleCheck, FaUserTie } from "react-icons/fa6";
/* eslint-disable @next/next/no-img-element */
import { Pagination } from "@/app/components/pagination/Pagination";

export const CVList = () => {
  const [listCV, setListCV] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/cv/list?page=${page}`, {
      method: "GET",
      credentials: "include", // Gửi kèm cookie
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          setListCV(data.listCV);
          if (data.totalPage) {
            setTotalPage(data.totalPage);
          }
        }
      });
  }, [page]);

  const handlePagination = (value: number) => {
    setPage(value);
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
        {listCV.map((item) => {
          const position = positionList.find((pos) => pos.value == item.jobPosition);
          const workingForm = workingFormList.find((form) => form.value == item.jobWorkingForm);
          const status = cvStatusList.find((itemStatus) => itemStatus.value == item.status);

          return (
            <div
              key={item.id}
              className="border border-[#DEDEDE] rounded-[8px] flex flex-col relative truncate"
              style={{
                background: "linear-gradient(180deg, #F6F6F6 2.38%, #FFFFFF 70.43%)",
              }}
            >
              <img src="/assets/images/card-bg.png" alt="" className="absolute top-[0px] left-[0px] w-[100%] h-auto" />
              <h3 className="mt-[20px] mx-[16px] font-[700] text-[18px] text-[#121212] text-center flex-1 whitespace-normal line-clamp-2">{item.jobTitle}</h3>
              <div className="mt-[12px] text-center font-[400] text-[14px] text-black">
                Công ty: <span className="font-[700]">{item.companyName}</span>
              </div>
              <div className="mt-[6px] text-center font-[600] text-[16px] text-[#0088FF]">{item.jobSalaryMin.toLocaleString("vi-VN")}$ - 1.500$</div>
              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                <FaUserTie className="text-[16px]" /> {position?.label}
              </div>
              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                <FaBriefcase className="text-[16px]" /> {workingForm?.label}
              </div>
              <div
                className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px]"
                style={{
                  color: `${status?.color}`,
                }}
              >
                <FaCircleCheck className="text-[16px]" /> {status?.label}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-[8px] mt-[12px] mb-[20px] mx-[10px]">
                <Link href="#" className="bg-[#0088FF] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]">
                  Xem
                </Link>
                <Link href="#" className="bg-[#FF0000] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]">
                  Xóa
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <Pagination totalPage={totalPage} page={page} onChange={handlePagination} />
    </>
  );
};
