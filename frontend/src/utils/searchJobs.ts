export type JobSearchFilters = {
  language?: string;
  city?: string;
  location?: string;
  company?: string;
  keyword?: string;
  position?: string;
  level?: string;
  workingForm?: string;
  type?: string;
  salaryMin?: number;
  salaryMax?: number;
  technologies?: string[];
  techStack?: string[];
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

// In-memory cache for search results
const searchCache = new Map<string, { data: SearchJobsResponse; timestamp: number }>();
const SEARCH_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const inFlightSearches = new Map<string, Promise<SearchJobsResponse>>();

function generateSearchKey(filters: JobSearchFilters): string {
  const allTech = filters.techStack && filters.techStack.length ? filters.techStack : filters.technologies || [];
  return JSON.stringify({
    language: filters.language,
    city: filters.city,
    location: filters.location,
    company: filters.company,
    keyword: filters.keyword,
    position: filters.position,
    level: filters.level,
    workingForm: filters.workingForm,
    type: filters.type,
    salaryMin: filters.salaryMin,
    salaryMax: filters.salaryMax,
    technologies: allTech,
    page: filters.page ?? 1,
  });
}

export async function searchJobs(filters: JobSearchFilters, options?: { signal?: AbortSignal }): Promise<SearchJobsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const cacheKey = generateSearchKey(filters);

  // Check if result is cached and not expired
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < SEARCH_CACHE_DURATION) {
    return cached.data;
  }

  // Return existing in-flight request to prevent duplicate searches
  if (inFlightSearches.has(cacheKey)) {
    return inFlightSearches.get(cacheKey)!;
  }

  const searchPromise = (async () => {
    try {
      const params = new URLSearchParams();

      if (filters.language) params.set("language", filters.language);
      if (filters.city) params.set("city", filters.city);
      if (filters.location) params.set("location", filters.location);
      if (filters.company) params.set("company", filters.company);
      if (filters.keyword) params.set("keyword", filters.keyword);
      if (filters.position) params.set("position", filters.position);
      if (filters.level) params.set("level", filters.level);
      if (filters.workingForm) params.set("workingForm", filters.workingForm);
      if (filters.type) params.set("type", filters.type);
      if (filters.salaryMin != null) params.set("salaryMin", String(filters.salaryMin));
      if (filters.salaryMax != null) params.set("salaryMax", String(filters.salaryMax));

      const allTech = filters.techStack && filters.techStack.length ? filters.techStack : filters.technologies;
      if (allTech && allTech.length) {
        allTech.forEach((tech) => {
          params.append("technologies", tech);
          params.append("techStack", tech);
        });
      }

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

      // Cache the successful result
      searchCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } finally {
      inFlightSearches.delete(cacheKey);
    }
  })();

  inFlightSearches.set(cacheKey, searchPromise);
  return searchPromise;
}

// Clear search cache for a specific key or all
export function clearSearchCache(pattern?: string) {
  if (!pattern) {
    searchCache.clear();
  } else {
    for (const key of searchCache.keys()) {
      if (key.includes(pattern)) {
        searchCache.delete(key);
      }
    }
  }
}
