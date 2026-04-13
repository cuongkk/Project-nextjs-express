"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/utils/api";
import { SectionJob } from "./SectionJob";
import { JobItem } from "../job/JobItem";
type RecommendJob = any & {
  matchScore?: number;
  matchedSkills?: string[];
  reasons?: string[];
};

export const SectionPropose = () => {
  const [jobs, setJobs] = useState<RecommendJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const topTitle = useMemo(() => {
    return {
      title: "Công việc cho bạn",
      sub: "Gợi ý việc làm dựa trên kỹ năng, vị trí và kinh nghiệm của bạn.",
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      setLoading(true);
      try {
        const res = await apiRequest<{ jobs: RecommendJob[] }>("/jobs/recommend?limit=12");
        if (!alive) return;
        if (res.code === "success" && Array.isArray((res as any).jobs)) {
          setJobs((res as any).jobs);
          setApiFailed(false);
        } else {
          setApiFailed(true);
        }
      } catch {
        if (alive) setApiFailed(true);
      } finally {
        if (alive) setLoading(false);
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, []);

  if (apiFailed) {
    return <SectionJob />;
  }

  return (
    <div className="py-[60px]">
      <div className="contain">
        <div className="flex items-center justify-between mb-[20px] lg:flex-row flex-col-reverse gap-[12px]">
          <div className="w-full flex flex-col gap-[4px] ">
            <h2 className="font-[700] sm:text-[24px] text-[20px] text-[#121212] mb-[4px]">{topTitle.title}</h2>
            <p className="text-[14px] text-[#6B6B6B]">{topTitle.sub}</p>
          </div>
          <div className="w-full align-self-start flex justify-end">
            <button
              type="button"
              onClick={() => router.push(`/search${searchParams.toString() ? `?${searchParams.toString()}` : ""}`)}
              className=" flex text-end border border-primary text-primary rounded-[4px] px-[16px] py-[8px] text-[14px] font-[500]"
            >
              Tìm kiếm nâng cao
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-[14px] text-[#6B6B6B]">Đang tải gợi ý...</div>
        ) : jobs.length === 0 ? (
          <div className="text-[14px] text-[#6B6B6B]">Chưa có gợi ý phù hợp. Hãy cập nhật kỹ năng trong hồ sơ để nhận đề xuất tốt hơn.</div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[20px]">
            {jobs.map((item) => (
              <JobItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
