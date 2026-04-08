/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { cvStatusList, positionList, workingFormList } from "@/configs/variable";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBriefcase, FaCircleCheck, FaEnvelope, FaEye, FaPhone, FaUserTie } from "react-icons/fa6";
/* eslint-disable @next/next/no-img-element */
import { Toaster, toast } from "sonner";
import { Pagination } from "@/components/ui/Pagination";

interface CvListProps {
  sortOrder: "newest" | "oldest";
  statusFilter: "all" | "pending" | "viewed" | "accepted" | "rejected";
}

export const CompanyCvList = ({ sortOrder, statusFilter }: CvListProps) => {
  const [listCV, setListCV] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [count, setCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", `${page}`);
    params.set("sort", sortOrder === "oldest" ? "oldest" : "newest");
    if (statusFilter !== "all") {
      params.set("status", statusFilter);
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications?${params.toString()}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "error") {
        }

        if (data.code == "success") {
          setListCV(Array.isArray(data.applications) ? data.applications : []);
          if (data.totalPage) {
            setTotalPage(data.totalPage);
          }
        }
        setIsLoaded(true);
      });
  }, [page, count, sortOrder, statusFilter]);

  const handlePagination = (value: number) => {
    setPage(value);
  };

  const handleChangeStatus = (id: string, status: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${id}`, {
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
  };

  const sortedList = [...listCV].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
  });

  const finalList = statusFilter === "all" ? sortedList : sortedList.filter((item) => item.status === statusFilter);

  return (
    <>
      <Toaster richColors position="top-right" toastOptions={{ duration: 1000 }} />
      {isLoaded && finalList.length === 0 ? (
        <p>Không có CV nào để quản lý.</p>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
            {finalList.map((item) => {
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
                    {item.status !== "accepted" && (
                      <button className="bg-[#9FDB7C] rounded-[4px] font-[400] text-[14px] text-black inline-block py-[8px] px-[20px]" onClick={() => handleChangeStatus(item.id, "accepted")}>
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
      )}
    </>
  );
};
