"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { JobItem } from "@/components/features/job/JobItem";
import { Pagination } from "@/components/ui/Pagination";
import { JobSearchFilters, JobSearchItem, searchJobs } from "@/utils/searchJobs";
import { useForm } from "react-hook-form";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [jobs, setJobs] = useState<JobSearchItem[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { handleSubmit } = useForm();

  const currentFilters: JobSearchFilters = useMemo(() => {
    const page = searchParams.get("page");
    const salaryMin = searchParams.get("salaryMin");
    const salaryMax = searchParams.get("salaryMax");
    return {
      keyword: searchParams.get("keyword") || undefined,
      city: searchParams.get("city") || undefined,
      position: searchParams.get("position") || undefined,
      workingForm: searchParams.get("workingForm") || undefined,
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
      page: page ? Number(page) : 1,
    };
  }, [searchParams]);

  const runSearch = async (filters: JobSearchFilters) => {
    setLoading(true);
    setError(null);

    try {
      const data = await searchJobs(filters);
      if (data.code === "success") {
        setJobs(data.jobs);
        setTotalPage(data.totalPage);
        setTotalRecord(data.totalRecord);
      } else {
        setJobs([]);
        setTotalPage(1);
        setTotalRecord(0);
        setError(data.message || "Tìm kiếm thất bại");
      }
    } catch (err) {
      setJobs([]);
      setTotalPage(1);
      setTotalRecord(0);
      setError("Không thể tải dữ liệu việc làm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasQuery = Array.from(searchParams.keys()).length > 0;
    if (!hasQuery) return;

    void runSearch(currentFilters);
  }, [currentFilters, searchParams]);

  const onSubmit = (data: any) => {
    const formData = new FormData(data.currentTarget);
    const keyword = (formData.get("keyword") as string) || "";
    const city = (formData.get("city") as string) || "";
    const position = (formData.get("position") as string) || "";
    const workingForm = (formData.get("workingForm") as string) || "";
    const salaryMin = (formData.get("salaryMin") as string) || "";
    const salaryMax = (formData.get("salaryMax") as string) || "";

    const params = new URLSearchParams();

    if (keyword) params.set("keyword", keyword);
    if (city) params.set("city", city);
    if (position) params.set("position", position);
    if (workingForm) params.set("workingForm", workingForm);
    if (salaryMin) params.set("salaryMin", salaryMin);
    if (salaryMax) params.set("salaryMax", salaryMax);
    params.set("page", "1");

    router.push(`/search?${params.toString()}`);
    void runSearch({
      keyword: keyword || undefined,
      city: city || undefined,
      position: position || undefined,
      workingForm: workingForm || undefined,
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
      page: 1,
    });
  };
  useEffect(() => {
    onSubmit({
      currentTarget: document.querySelector("form") as HTMLFormElement,
    } as any);
  }, []);

  const handlePaginationChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }

    router.push(`/search?${params.toString()}`);
    void runSearch({
      ...currentFilters,
      page,
    });
  };

  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          <div className="flex items-center justify-between mb-[20px]">
            <h2 className="font-[600] text-[20px] text-[#121212]">Tìm kiếm nâng cao</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit) as any} className="flex flex-wrap gap-[15px] mb-[30px]">
            <input
              type="text"
              name="keyword"
              defaultValue={searchParams.get("keyword") || ""}
              className="flex-1 h-[40px] rounded-[4px] px-[20px] font-[500] text-[16px] text-[#121212] bg-white border border-[#DEDEDE]"
              placeholder="Tìm công việc"
            />
            <input
              type="text"
              name="city"
              defaultValue={searchParams.get("city") || ""}
              className="md:w-[240px] w-[100%] h-[40px] rounded-[4px] px-[20px] font-[500] text-[16px] text-[#121212] bg-white border border-[#DEDEDE]"
              placeholder="Thành phố"
            />
            <input
              type="text"
              name="position"
              defaultValue={searchParams.get("position") || ""}
              className="md:w-[240px] w-[100%] h-[40px] rounded-[4px] px-[20px] font-[500] text-[16px] text-[#121212] bg-white border border-[#DEDEDE]"
              placeholder="Tìm vị trí"
            />
            <input
              type="number"
              name="salaryMin"
              defaultValue={searchParams.get("salaryMin") || ""}
              className="md:w-[160px] w-[48%] h-[40px] rounded-[4px] px-[20px] font-[500] text-[16px] text-[#121212] bg-white border border-[#DEDEDE]"
              placeholder="Lương tối thiểu"
            />
            <input
              type="number"
              name="salaryMax"
              defaultValue={searchParams.get("salaryMax") || ""}
              className="md:w-[160px] w-[48%] h-[40px] rounded-[4px] px-[20px] font-[500] text-[16px] text-[#121212] bg-white border border-[#DEDEDE]"
              placeholder="Lương tối đa"
            />
            <button type="submit" className="md:w-[200px] w-[100%] h-[40px] bg-primary rounded-[4px] text-white font-[500] text-[16px] flex items-center justify-center">
              {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
            </button>
          </form>

          {error && <p className="text-red-500 text-[14px] mb-[10px]">{error}</p>}

          {!loading && !error && jobs.length === 0 && <p className="text-[14px] text-[#666666] mb-[10px]">Không tìm thấy công việc phù hợp.</p>}

          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[20px]">
            {jobs.map((item) => (
              <JobItem key={item.id} item={item} />
            ))}
          </div>

          {totalPage > 1 && <Pagination totalPage={totalPage} page={currentFilters.page || 1} onChange={handlePaginationChange} />}
        </div>
      </div>
    </>
  );
}
