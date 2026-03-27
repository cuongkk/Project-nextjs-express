"use client";

import { CvList } from "../../../components/features/cv/CvList";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/* eslint-disable @next/next/no-img-element */
export default function Page() {
  const router = useRouter();
  const { infoUser, infoCompany, isLogin, isAuthLoaded } = useAuth();

  const role: "user" | "company" | null = infoCompany ? "company" : infoUser ? "user" : null;

  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [statusFilter, setStatusFilter] = useState<"all" | "initial" | "approved" | "rejected">("all");
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [companyJobs, setCompanyJobs] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!isLogin || !role) {
      router.replace("/login");
    }
  }, [isAuthLoaded, isLogin, role, router]);

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!isLogin || role !== "company") return;

    const params = new URLSearchParams();
    params.set("limit", "1000");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/company/${infoCompany?.id}?${params.toString()}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success" && Array.isArray(data.jobs)) {
          setCompanyJobs(
            data.jobs.map((job: any) => ({
              id: job.id,
              title: job.title,
            })),
          );
        }
      })
      .catch(() => {
        // ignore
      });
  }, [isAuthLoaded, isLogin, role]);

  if (!isAuthLoaded || !isLogin || !role) {
    return null;
  }

  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          <h2 className="font-[700] sm:text-[28px] text-[24px] sm:w-auto w-[100%] text-[#121212] mb-[20px]">{role === "company" ? "Quản lý CV" : "Quản lý CV đã gửi"}</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2 text-[14px]">
              <span className="font-[700]">Thời gian:</span>
              <select className="border border-[#DEDEDE] rounded-[4px] px-2 py-1 text-[14px]" value={sortOrder} onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}>
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-[14px]">
              <span className="font-[700]">Trạng thái:</span>
              <select className="border border-[#DEDEDE] rounded-[4px] px-2 py-1 text-[14px]" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                <option value="all">Tất cả</option>
                <option value="initial">Chưa duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
            {role === "company" && (
              <div className="flex items-center gap-2 text-[14px]">
                <span className="font-[700]">Công việc:</span>
                <select className="border border-[#DEDEDE] rounded-[4px] px-2 py-1 text-[14px]" value={jobFilter} onChange={(e) => setJobFilter(e.target.value)}>
                  <option value="all">Tất cả</option>
                  {companyJobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <CvList role={role} sortOrder={sortOrder} statusFilter={statusFilter} jobIdFilter={role === "company" ? jobFilter : undefined} />
        </div>
      </div>
    </>
  );
}
