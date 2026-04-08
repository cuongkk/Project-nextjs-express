"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { JobItem } from "@/components/features/job/JobItem";
import { Pagination } from "@/components/ui/Pagination";
import { JobSearchFilters, JobSearchItem, searchJobs } from "@/utils/searchJobs";
import { TechCheckboxGroup } from "@/components/ui/CheckBoxList";
import { CustomSelect } from "@/components/ui/CustomSelect";

export default function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [techList, setTechList] = useState<string[]>([]);
  const [cityList, setCityList] = useState<{ _id: string; name: string }[]>([]);
  const [positionList, setPositionList] = useState<string[]>([]);
  const [jobs, setJobs] = useState<JobSearchItem[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showTechFilters, setShowTechFilters] = useState<boolean>(false);

  const currentFilters: JobSearchFilters = useMemo(() => {
    const page = searchParams.get("page");
    const salaryMin = searchParams.get("salaryMin");
    const salaryMax = searchParams.get("salaryMax");
    const company = searchParams.get("company");
    const keywordParam = searchParams.get("keyword") || searchParams.get("title") || undefined;
    const technologies = searchParams.getAll("technologies");
    return {
      keyword: keywordParam,
      city: searchParams.get("city") || undefined,
      company: company || undefined,
      position: searchParams.get("position") || undefined,
      workingForm: searchParams.get("workingForm") || undefined,
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
      technologies: technologies.length ? technologies : undefined,
      page: page ? Number(page) : 1,
    };
  }, [searchParams]);

  useEffect(() => {
    setSelectedTechnologies(currentFilters.technologies || []);
  }, [currentFilters.technologies]);

  const initialKeyword = useMemo(() => {
    const keywordParam = searchParams.get("keyword");
    if (keywordParam) return keywordParam;

    const companyParam = searchParams.get("company");
    if (companyParam) return companyParam;

    const titleParam = searchParams.get("title");
    if (titleParam) return titleParam;

    return "";
  }, [searchParams]);

  const runSearch = async (filters: JobSearchFilters) => {
    setLoading(true);
    setError(null);

    try {
      const data = await searchJobs(filters);
      if (data.code === "success") {
        setJobs(data.jobs);
        setTotalPage(data.totalPage);
      } else {
        setJobs([]);
        setTotalPage(1);
        setError(data.message || "Tìm kiếm thất bại");
      }
    } catch (err) {
      setJobs([]);
      setTotalPage(1);
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
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
    if (selectedTechnologies.length) {
      selectedTechnologies.forEach((tech) => {
        params.append("technologies", tech);
      });
    }
    params.set("page", "1");

    router.push(`/search?${params.toString()}`);
    void runSearch({
      keyword: keyword || undefined,
      city: city || undefined,
      position: position || undefined,
      workingForm: workingForm || undefined,
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
      technologies: selectedTechnologies.length ? selectedTechnologies : undefined,
      page: 1,
    });
  };

  useEffect(() => {
    const hasQuery = Array.from(searchParams.keys()).length > 0;
    if (hasQuery) return;

    void runSearch({ page: 1 });
    router.replace("/search?page=1");
  }, [router, searchParams]);

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

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/all`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          setCityList(data.listCity || []);
          setPositionList(data.positions || []);
          setTechList(data.techList || []);
        } else {
          setCityList([]);
          setPositionList([]);
          setTechList([]);
        }
      });
  }, []);

  const techLabel = selectedTechnologies.length ? selectedTechnologies.join(", ") : "Công nghệ";

  return (
    <div className="py-[60px]">
      <div className="contain">
        <div className="flex items-center justify-between mb-[20px]">
          <h2 className="font-[600] text-[20px] text-[#121212]">Tìm kiếm nâng cao</h2>
        </div>

        <form onSubmit={onSubmit as any} className="flex flex-col flex-wrap gap-[15px] mb-[30px]">
          <div className="flex flex-wrap gap-[15px]">
            <input
              type="text"
              name="keyword"
              defaultValue={initialKeyword}
              className="md:w-[240px] w-[48%] h-[40px] rounded-[4px] px-[20px] font-[500] text-[16px] text-[#121212] bg-white border border-[#DEDEDE]"
              placeholder="Tên công việc, công ty"
            />
            <CustomSelect
              defaultName="Chọn thành phố"
              name="city"
              defaultValue={searchParams.get("city") || ""}
              options={cityList.map((city) => ({
                label: city.name,
                value: city.name,
              }))}
            />
            <CustomSelect
              defaultName="Chọn vị trí"
              name="position"
              defaultValue={searchParams.get("position") || ""}
              options={positionList.map((position) => ({
                label: position.charAt(0).toUpperCase() + position.slice(1),
                value: position,
              }))}
            />
            <div>
              <button
                type="button"
                onClick={() => setShowTechFilters((prev) => !prev)}
                className="md:w-[160px] w-[100%] h-[40px] rounded-[4px] px-[20px] font-[500] text-[14px] text-[#121212] bg-white border border-[#DEDEDE] flex items-center justify-between"
              >
                <span>{techLabel}</span>
                <span>{showTechFilters}</span>
              </button>
              {showTechFilters && techList.length > 0 && (
                <div className="mt-[10px]">
                  <TechCheckboxGroup id="technologies" List={techList} value={selectedTechnologies} onChange={(newTechs) => setSelectedTechnologies(newTechs)} />
                </div>
              )}
            </div>
            <input
              type="number"
              name="salaryMin"
              defaultValue={searchParams.get("salaryMin") || ""}
              className="md:w-[200px] w-[48%] h-[40px] rounded-[4px] px-[20px] font-[500] text-[16px] text-[#121212] bg-white border border-[#DEDEDE]"
              placeholder="Lương tối thiểu"
            />
            <button type="submit" className="md:w-[200px] h-[40px] bg-primary rounded-[4px] text-white font-[500] text-[16px] flex items-center justify-center">
              {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
            </button>
          </div>
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
  );
}
