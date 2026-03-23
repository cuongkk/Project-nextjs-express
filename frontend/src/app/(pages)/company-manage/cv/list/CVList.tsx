/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { cvStatusList, positionList, workingFormList } from "@/configs/variable";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBriefcase, FaCircleCheck, FaEnvelope, FaEye, FaPhone, FaUserTie } from "react-icons/fa6";
/* eslint-disable @next/next/no-img-element */
import { Toaster, toast } from "sonner";
import { Pagination } from "@/app/components/pagination/Pagination";

export const CVList = () => {
  const [listCV, setListCV] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/cv/list?page=${page}`, {
      method: "GET",
      credentials: "include", // Gửi kèm cookie
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "error") {
        }

        if (data.code == "success") {
          setListCV(data.listCV);
          if (data.totalPage) {
            setTotalPage(data.totalPage);
          }
        }
      });
  }, [page, count]);

  const handlePagination = (value: number) => {
    setPage(value);
  };

  const handleChangeStatus = (id: string, status: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/cv/change-status`, {
      method: "PATCH",
      credentials: "include", // Gửi kèm cookie
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        status: status,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "error") {
          toast.error(data.message);
        }
        if (data.code == "success") {
          toast.success(data.message);
          setCount(count + 1);
        }
      });
  };

  const handleDelete = (id: string) => {
    const result = window.confirm("Bạn có chắc muốn xóa CV này?");
    if (result) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/cv/delete/${id}`, {
        method: "DELETE",
        credentials: "include", // Gửi kèm cookie
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "error") {
            toast.error(data.message);
          }
          if (data.code == "success") {
            toast.success(data.message);
            setCount(count + 1);
          }
        });
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
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
                Ứng viên: <span className="font-[700]">{item.fullName}</span>
              </div>
              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                <FaEnvelope className="" /> {item.email}
              </div>
              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                <FaPhone className="" /> {item.phone}
              </div>
              <div className="mt-[12px] text-center font-[600] text-[16px] text-[#0088FF]">
                {item.jobSalaryMin.toLocaleString("vi-VN")}$ - {item.jobSalaryMax.toLocaleString("vi-VN")}$
              </div>
              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                <FaUserTie className="text-[16px]" /> {position?.label}
              </div>
              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                <FaBriefcase className="text-[16px]" /> {workingForm?.label}
              </div>
              <div className={"mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] " + (item.viewed ? "text-[#121212]" : "text-[#FF0000]")}>
                <FaEye className="text-[16px]" /> {item.viewed ? "Đã xem" : "Chưa xem"}
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
                <Link href={`/company-manage/cv/detail/${item.id}`} className="bg-[#0088FF] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]">
                  {" "}
                  Xem
                </Link>
                {item.status !== "approved" && (
                  <button className="bg-[#9FDB7C] rounded-[4px] font-[400] text-[14px] text-black inline-block py-[8px] px-[20px]" onClick={() => handleChangeStatus(item.id, "approved")}>
                    {" "}
                    Duyệt
                  </button>
                )}
                {item.status !== "rejected" && (
                  <button className="bg-[#FF5100] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]" onClick={() => handleChangeStatus(item.id, "rejected")}>
                    Từ chối
                  </button>
                )}
                <button className="bg-[#FF0000] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]" onClick={() => handleDelete(item.id)}>
                  Xóa
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Pagination totalPage={totalPage} page={page} onChange={handlePagination} />
    </>
  );
};
