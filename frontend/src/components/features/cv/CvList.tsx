/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { cvStatusList } from "@/configs/variable";
import Link from "next/link";
import { useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
/* eslint-disable @next/next/no-img-element */
import { Pagination } from "@/components/ui/Pagination";
import { toast } from "sonner";
import { useCVList, type ApplicationItem } from "@/hooks/useApiData";

interface CvListProps {
  role: "user" | "company";
  sortOrder: "newest" | "oldest";
  statusFilter: "all" | "applied" | "screening" | "interview" | "offer" | "hired" | "rejected";
  jobIdFilter?: string | null;
}

export const CvList = ({ role, sortOrder, statusFilter, jobIdFilter }: CvListProps) => {
  const [page, setPage] = useState(1);
  const { applications, totalPage, isLoading, mutate } = useCVList(page, sortOrder, statusFilter, jobIdFilter || undefined);

  const handlePagination = (value: number) => {
    setPage(value);
  };

  const toTime = (value?: string) => {
    if (!value) return 0;
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? 0 : time;
  };

  const sortedList = [...applications].sort((a, b) => {
    const aTime = toTime(a.createdAt);
    const bTime = toTime(b.createdAt);
    return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
  });

  const finalList = statusFilter === "all" ? sortedList : sortedList.filter((item) => item.status === statusFilter);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa đơn ứng tuyển này không?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (data.code === "error") {
        toast.error(data.message || "Xóa đơn ứng tuyển thất bại!");
        return;
      }

      toast.success(data.message || "Đã xóa đơn ứng tuyển!");
      mutate(); // Refresh the list
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  if (isLoading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  return (
    <>
      {finalList.length === 0 ? (
        <p>Không có CV nào đã gửi.</p>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
            {finalList.map((item: ApplicationItem) => {
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
                    <Link href={`/cv/${item.id}`} className="bg-[#0088FF] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]">
                      Xem
                    </Link>
                    {role === "company" && item.userId && item.jobId && (
                      <Link
                        href={`/chat?jobId=${encodeURIComponent(item.jobId)}&userId=${encodeURIComponent(item.userId)}`}
                        className="bg-[#111827] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]"
                      >
                        Chat
                      </Link>
                    )}
                    {item.status === "rejected" && (
                      <button type="button" onClick={() => handleDelete(item.id)} className="bg-[#FF0000] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]">
                        Xóa
                      </button>
                    )}
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
