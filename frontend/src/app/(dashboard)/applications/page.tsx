"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CvList } from "@/components/features/cv/CvList";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function ApplicationsPage() {
  usePageTitle("Đơn ứng tuyển của tôi");

  const router = useRouter();
  const { infoUser, isLogin, isAuthLoaded } = useAuth();
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [statusFilter, setStatusFilter] = useState<"all" | "applied" | "screening" | "interview" | "offer" | "hired" | "rejected">("all");

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!isLogin || !infoUser) {
      router.replace("/login");
    }
  }, [isAuthLoaded, isLogin, infoUser, router]);

  if (!isAuthLoaded || !isLogin || !infoUser) {
    return null;
  }

  return (
    <div className="py-[60px]">
      <div className="contain">
        <h1 className="font-[700] text-[24px] text-[#121212] mb-[20px]">Đơn ứng tuyển</h1>

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
              <option value="applied">Applied</option>
              <option value="screening">Screening</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <CvList role="user" sortOrder={sortOrder} statusFilter={statusFilter} />
      </div>
    </div>
  );
}
