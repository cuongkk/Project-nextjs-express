/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { cvStatusList } from "@/configs/variable";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
/* eslint-disable @next/next/no-img-element */
import { Pagination } from "@/components/ui/Pagination";

interface CvListProps {
  role: "user" | "company";
  sortOrder: "newest" | "oldest";
  statusFilter: "all" | "initial" | "approved" | "rejected";
  jobIdFilter?: string | null;
}

export const CvList = ({ role, sortOrder, statusFilter, jobIdFilter }: CvListProps) => {
  const [listCV, setListCV] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", `${page}`);
    params.set("sort", sortOrder === "oldest" ? "oldest" : "newest");
    if (statusFilter !== "all") {
      params.set("status", statusFilter);
    }

    if (role === "company" && jobIdFilter && jobIdFilter !== "all") {
      params.set("jobId", jobIdFilter);
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications?${params.toString()}`, {
      method: "GET",
      credentials: "include", // Gửi kèm cookie
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          setListCV(Array.isArray(data.applications) ? data.applications : []);
          if (data.totalPage) {
            setTotalPage(data.totalPage);
          }
        }
        setIsLoaded(true);
      });
  }, [page, sortOrder, statusFilter, role, jobIdFilter]);

  const handlePagination = (value: number) => {
    setPage(value);
  };

  const sortedList = [...listCV].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
  });

  const finalList = statusFilter === "all" ? sortedList : sortedList.filter((item) => item.status === statusFilter);

  return (
    <>
      {isLoaded && finalList.length === 0 ? (
        <p>Không có CV nào đã gửi.</p>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
            {finalList.map((item: any) => {
              const status = cvStatusList.find((itemStatus) => itemStatus.value === item.status);

              const companyName = item.companyName ?? "";
              const candidateName = item.candidateName ?? "";
              const candidateEmail = item.candidateEmail ?? "";
              const candidatePhone = item.candidatePhone ?? "";

              return (
                <div
                  key={item.id}
                  className="border border-[#DEDEDE] rounded-[8px] flex flex-col relative truncate"
                  style={{
                    background: "linear-gradient(180deg, #F6F6F6 2.38%, #FFFFFF 70.43%)",
                  }}
                >
                  <h3 className="mt-[20px] mx-[16px] font-[700] text-[18px] text-[#121212] text-center flex-1 whitespace-normal line-clamp-2">{item.jobTitle}</h3>

                  {role === "user" && (
                    <div className="mt-[12px] text-center font-[400] text-[14px] text-black">
                      Công ty: <span className="font-[700]">{companyName}</span>
                    </div>
                  )}

                  {role === "company" && (
                    <div className="mt-[12px] text-center font-[400] text-[14px] text-black flex flex-col gap-[4px]">
                      <span>
                        Ứng viên: <span className="font-[700]">{candidateName}</span>
                      </span>
                      {candidateEmail && <span>Email: {candidateEmail}</span>}
                      {candidatePhone && <span>SĐT: {candidatePhone}</span>}
                    </div>
                  )}

                  <div
                    className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px]"
                    style={{
                      color: `${status?.color}`,
                    }}
                  >
                    <FaCircleCheck className="text-[16px]" /> {status?.label}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-[8px] mt-[12px] mb-[20px] mx-[10px]">
                    <Link href={`cv/${item.id}`} className="bg-[#0088FF] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]">
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
      )}
    </>
  );
};
