"use client";

// FIXED: Convert to client component using useAuth for role detection
// FIXED: Fetch application detail on client with credentials and show Accept button for companies

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { cvStatusList } from "@/configs/variable";
import { toast } from "sonner";

type Role = "user" | "company";

type CvStatus = "initial" | "approved" | "rejected";

interface ApplicationDetail {
  id: string;
  status: CvStatus;
  jobId: string;
  jobTitle: string;
  companyName?: string;
  candidateName?: string;
  candidateEmail?: string;
  candidatePhone?: string;
  fileCv?: string;
  createdAt?: string;
}

interface ApplicationApiResponse {
  code: string;
  message?: string;
  application?: {
    _id?: string;
    id?: string;
    status: CvStatus;
    jobId: string;
    createdAt?: string;
  };
  job?: {
    _id?: string;
    id?: string;
    title?: string;
  };
  company?: {
    companyName?: string;
  };
  cv?: {
    userName?: string;
    email?: string;
    phone?: string;
    fileCV?: string;
  };
}

/* eslint-disable @next/next/no-img-element */
export default function CvDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { infoUser, infoCompany, isLogin, isAuthLoaded } = useAuth();

  const role: Role | null = infoCompany ? "company" : infoUser ? "user" : null; // FIXED: detect role from auth

  const [detail, setDetail] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!isLogin || !role) {
      router.replace("/login");
      return;
    }

    const idParam = params?.id;
    const applicationId = typeof idParam === "string" ? idParam : Array.isArray(idParam) ? idParam[0] : "";
    if (!applicationId) {
      setError("Thiếu mã CV.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}`, {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });

        if (res.status === 401) {
          router.replace("/login");
          return;
        }

        if (res.status === 403) {
          setError("Bạn không có quyền xem CV này.");
          setLoading(false);
          return;
        }

        const data: ApplicationApiResponse = await res.json();

        if (data.code !== "success" || !data.application) {
          setError(data.message || "Không thể tải thông tin CV.");
          setLoading(false);
          return;
        }

        const app = data.application;
        const job = data.job;
        const company = data.company;
        const cv = data.cv;

        const mapped: ApplicationDetail = {
          id: app.id || app._id || applicationId,
          status: app.status,
          jobId: app.jobId,
          jobTitle: job?.title || "",
          companyName: company?.companyName,
          candidateName: cv?.userName,
          candidateEmail: cv?.email,
          candidatePhone: cv?.phone,
          fileCv: cv?.fileCV,
          createdAt: app.createdAt,
        };

        setDetail(mapped);
        setLoading(false);
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setError("Có lỗi xảy ra. Vui lòng thử lại.");
          setLoading(false);
        }
      }
    };

    fetchDetail();

    return () => {
      controller.abort();
    };
  }, [isAuthLoaded, isLogin, role, params, router]);

  const handleAccept = async () => {
    if (!detail || role !== "company" || detail.status !== "initial") return;

    setIsUpdating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${detail.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: "approved" }), // ADDED: Accept CV = approved
      });

      const data = (await res.json()) as { code: string; message?: string };

      if (data.code === "success") {
        setDetail({ ...detail, status: "approved" });
        toast.success(data.message || "Đã chấp nhận CV thành công!");
      } else {
        toast.error(data.message || "Không thể cập nhật trạng thái CV.");
      }
    } catch {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isAuthLoaded || !isLogin || !role) {
    return null;
  }

  if (loading) {
    return (
      <div className="py-[60px]">
        <div className="contain">Đang tải thông tin CV...</div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="py-[60px]">
        <div className="contain text-red-600">{error || "Không tìm thấy CV."}</div>
      </div>
    );
  }

  const statusMeta = cvStatusList.find((item) => item.value === detail.status);
  const canAccept = role === "company" && detail.status === "initial";

  return (
    <div className="py-[60px]">
      <div className="contain max-w-3xl">
        <div className="flex flex-wrap gap-[20px] items-center justify-between mb-[20px]">
          <h1 className="sm:w-auto w-[100%] font-[700] text-[20px] text-black">Chi tiết CV</h1>
          <Link href="/cv" className="font-[400] text-[14px] text-[#0088FF] underline">
            Quay lại danh sách
          </Link>
        </div>

        <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mb-4 bg-[#F9F9F9]">
          <div className="mb-2">
            <span className="font-[700]">Công việc: </span>
            <span>{detail.jobTitle}</span>
          </div>

          {role === "user" && (
            <div className="mb-2">
              <span className="font-[700]">Công ty: </span>
              <span>{detail.companyName}</span>
            </div>
          )}

          {role === "company" && (
            <div className="mb-2 flex flex-col gap-1">
              <div>
                <span className="font-[700]">Ứng viên: </span>
                <span>{detail.candidateName}</span>
              </div>
              {detail.candidateEmail && (
                <div>
                  <span className="font-[700]">Email: </span>
                  <span>{detail.candidateEmail}</span>
                </div>
              )}
              {detail.candidatePhone && (
                <div>
                  <span className="font-[700]">SĐT: </span>
                  <span>{detail.candidatePhone}</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-2 flex items-center gap-2 text-[14px]" style={{ color: statusMeta?.color }}>
            <span className="font-[700]">Trạng thái:</span>
            <span>{statusMeta?.label}</span>
          </div>

          {detail.fileCv && (
            <div className="mt-3">
              <div className="font-[400] text-[16px] text-black mb-[10px]">File CV:</div>
              <div className="bg-[#D9D9D9] h-[736px]">
                {detail.fileCv.includes("/raw/") ? (
                  <iframe src={`https://docs.google.com/gview?url=${detail.fileCv}&embedded=true`} width="100%" height="100%" />
                ) : (
                  <img src={detail.fileCv} alt="CV" className="w-full h-full object-contain" />
                )}
              </div>
            </div>
          )}
        </div>

        {role === "company" && (
          <button
            type="button"
            onClick={handleAccept}
            disabled={!canAccept || isUpdating}
            className={`px-4 py-2 rounded text-white text-[14px] ${canAccept ? "bg-[#16A34A] hover:bg-[#15803D]" : "bg-[#9CA3AF] cursor-not-allowed"}`}
          >
            {detail.status === "approved" ? "Đã chấp nhận CV" : isUpdating ? "Đang xử lý..." : "Chấp nhận CV"}
          </button>
        )}
      </div>
    </div>
  );
}
