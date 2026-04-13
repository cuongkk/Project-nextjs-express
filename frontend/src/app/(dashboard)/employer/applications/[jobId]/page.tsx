"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { apiRequest } from "@/utils/api";
import { toast } from "sonner";

type PipelineStatus = "applied" | "screening" | "interview" | "offer" | "hired" | "rejected";

type ApplicationItem = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  status: PipelineStatus;
  jobTitle: string;
};

const columns: PipelineStatus[] = ["applied", "screening", "interview", "offer", "hired", "rejected"];

const nextStatusMap: Record<PipelineStatus, PipelineStatus[]> = {
  applied: ["screening", "rejected"],
  screening: ["interview", "offer", "rejected"],
  interview: ["offer", "rejected"],
  offer: ["hired", "rejected"],
  hired: [],
  rejected: [],
};

export default function EmployerApplicationsByJobPage() {
  usePageTitle("Pipeline tuyển dụng");

  const params = useParams<{ jobId: string }>();
  const router = useRouter();
  const { infoCompany, isLogin, isAuthLoaded } = useAuth();

  const [list, setList] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const jobId = params.jobId;

  const grouped = useMemo(() => {
    return columns.reduce(
      (acc, col) => {
        acc[col] = list.filter((item) => item.status === col);
        return acc;
      },
      {} as Record<PipelineStatus, ApplicationItem[]>,
    );
  }, [list]);

  const fetchData = async () => {
    setLoading(true);
    const data = await apiRequest<{ applications?: ApplicationItem[] }>(`/applications?jobId=${jobId}&page=1`);
    if (data.code === "success") {
      setList(data.applications || []);
    } else {
      toast.error(data.message || "Không thể tải danh sách ứng tuyển");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!isLogin || !infoCompany) {
      router.replace("/login");
      return;
    }

    fetchData();
  }, [isAuthLoaded, isLogin, infoCompany, jobId, router]);

  const updateStatus = async (id: string, status: PipelineStatus) => {
    const payload: Record<string, unknown> = { status };

    if (status === "interview") {
      const interviewDate = window.prompt("Nhập lịch phỏng vấn (VD: 2026-04-15T09:00:00)");
      if (!interviewDate) return;
      payload.interviewDate = interviewDate;
    }

    const data = await apiRequest(`/applications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (data.code === "success") {
      toast.success(data.message || "Cập nhật trạng thái thành công");
      fetchData();
      return;
    }

    toast.error(data.message || "Cập nhật trạng thái thất bại");
  };

  if (!isAuthLoaded || !isLogin || !infoCompany) {
    return null;
  }

  return (
    <div className="py-[40px]">
      <div className="contain">
        <div className="flex items-center justify-between mb-[20px]">
          <h1 className="font-[700] text-[24px]">Recruitment Pipeline</h1>
          <button type="button" className="text-primary underline" onClick={() => router.push("/cv")}>
            Quay lại
          </button>
        </div>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <div className="grid xl:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-[12px]">
            {columns.map((status) => (
              <div key={status} className="bg-[#F6F8FA] border border-[#DEDEDE] rounded-[8px] p-[10px] min-h-[220px]">
                <h3 className="font-[700] text-[14px] uppercase mb-[10px]">{status}</h3>
                <div className="flex flex-col gap-[8px]">
                  {(grouped[status] || []).map((app) => (
                    <div key={app.id} className="bg-white border border-[#E5E7EB] rounded-[6px] p-[10px]">
                      <div className="font-[600] text-[14px] line-clamp-2">{app.candidateName || "Candidate"}</div>
                      <div className="text-[12px] text-[#6B7280] line-clamp-1">{app.candidateEmail}</div>
                      <div className="text-[12px] text-[#6B7280] mb-[8px]">{app.candidatePhone}</div>

                      <div className="flex flex-wrap gap-[6px]">
                        {nextStatusMap[status].map((next) => (
                          <button key={next} type="button" onClick={() => updateStatus(app.id, next)} className="text-[11px] px-[8px] py-[4px] rounded bg-[#111827] text-white">
                            {next}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
