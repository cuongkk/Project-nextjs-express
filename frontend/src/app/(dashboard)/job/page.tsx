"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { Pagination } from "@/components/ui/Pagination";
import { JobItem } from "@/components/features/job/JobItem";

export default function Page() {
  const [jobList, setJobList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [count, setCount] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jobIdToDelete, setJobIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/?page=${page}`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          setJobList(data.jobs);
          if (data.totalPage) {
            setTotalPage(data.totalPage);
          }
        }
      });
  }, [page, count]);

  const handlePagination = (value: number) => {
    setPage(value);
  };

  const openDeleteConfirm = (id: string) => {
    setJobIdToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (!jobIdToDelete) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobIdToDelete}`, {
      method: "DELETE",
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "error") {
          toast.error(data.message);
        }
        if (data.code === "success") {
          toast.success(data.message);
          setCount((prev) => prev + 1);
          setShowDeleteConfirm(false);
          setJobIdToDelete(null);
        }
      })
      .catch(() => {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      });
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setJobIdToDelete(null);
  };

  return (
    <>
      <Toaster richColors position="top-right" />

      <div className="py-[60px]">
        <div className="contain">
          {/* Header */}
          <div className="flex flex-wrap gap-[20px] items-center justify-between mb-[20px]">
            <h2 className="font-[700] sm:text-[28px] text-[24px] text-[#121212]">Quản lý công việc</h2>

            <Link href="/job/create" className="bg-[#0088FF] rounded-[4px] text-white py-[8px] px-[20px]">
              Thêm mới
            </Link>
          </div>

          {/* List */}
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-[10px] gap-[20px]">
            {jobList.map((item: any) => (
              <div key={item.id}>
                <JobItem item={item} />
                <div className="w-[100%] flex flex-row justify-center gap-[10px] mt-[8px]">
                  <Link href={`/job/edit/${item.id}`} className="bg-[#FFB200] rounded-[4px] text-black py-[8px] px-[20px]">
                    Sửa
                  </Link>
                  <button onClick={() => openDeleteConfirm(item.id)} className="bg-[#FF0000] rounded-[4px] text-white py-[8px] px-[20px]">
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-[8px] p-[20px] max-w-[400px] w-full mx-[16px]">
                <h2 className="font-[700] text-[18px] text-[#121212] mb-[10px]">Xác nhận xóa công việc</h2>
                <p className="font-[400] text-[14px] text-[#121212] mb-[16px]">Bạn có chắc chắn muốn xóa công việc này? Hành động này không thể hoàn tác.</p>
                <div className="flex justify-end gap-[10px]">
                  <button type="button" onClick={handleCancelDelete} className="px-[16px] py-[8px] rounded-[4px] border border-[#DEDEDE] text-[#121212]">
                    Hủy
                  </button>
                  <button type="button" onClick={handleConfirmDelete} className="px-[16px] py-[8px] rounded-[4px] bg-[#FF0000] text-white">
                    Xác nhận xóa
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Pagination */}
          <Pagination totalPage={totalPage} page={page} onChange={handlePagination} />
        </div>
      </div>
    </>
  );
}
