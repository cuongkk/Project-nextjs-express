export type JobSearchFilters = {
  language?: string;
  city?: string;
  company?: string;
  keyword?: string;
  position?: string;
  workingForm?: string;
  salaryMin?: number;
  salaryMax?: number;
  page?: number;
};

export type JobSearchItem = {
  id: string;
  companyLogo: string;
  title: string;
  companyName: string;
  salaryMin: number;
  salaryMax: number;
  position: string;
  workingForm: string;
  companyCity: string;
  technologies: string[];
};

export type SearchJobsResponse = {
  code: string;
  message: string;
  jobs: JobSearchItem[];
  totalPage: number;
  totalRecord: number;
};

export async function searchJobs(filters: JobSearchFilters, options?: { signal?: AbortSignal }): Promise<SearchJobsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const params = new URLSearchParams();

  if (filters.language) params.set("language", filters.language);
  if (filters.city) params.set("city", filters.city);
  if (filters.company) params.set("company", filters.company);
  if (filters.keyword) params.set("keyword", filters.keyword);
  if (filters.position) params.set("position", filters.position);
  if (filters.workingForm) params.set("workingForm", filters.workingForm);
  if (filters.salaryMin != null) params.set("salaryMin", String(filters.salaryMin));
  if (filters.salaryMax != null) params.set("salaryMax", String(filters.salaryMax));

  const page = filters.page ?? 1;
  params.set("page", String(page));

  const res = await fetch(`${baseUrl}/search?${params.toString()}`, {
    method: "GET",
    signal: options?.signal,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  const data = (await res.json()) as SearchJobsResponse;
  return data;
}
