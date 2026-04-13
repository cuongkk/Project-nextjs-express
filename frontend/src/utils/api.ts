export type ApiResponse<T = unknown> = {
  code: string;
  message?: string;
} & T;

// In-memory cache for API requests
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes default

// Map to track in-flight requests to prevent duplicates
const inFlightRequests = new Map<string, Promise<unknown>>();

export async function apiRequest<T = unknown>(path: string, init?: RequestInit & { skipCache?: boolean; cacheDuration?: number }): Promise<ApiResponse<T>> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const cacheKey = `${init?.method || "GET"}:${path}`;
  const cacheDuration = init?.cacheDuration ?? CACHE_DURATION;

  // Return cached data if available and not expired
  if (init?.method !== "POST" && init?.method !== "PATCH" && init?.method !== "DELETE" && !init?.skipCache) {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      return cached.data as ApiResponse<T>;
    }
  }

  // Return pending request if it's already in-flight (deduplication)
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey) as Promise<ApiResponse<T>>;
  }

  const requestPromise = (async () => {
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        credentials: "include",
        ...init,
      });

      const data = (await res.json()) as ApiResponse<T>;

      // Only cache successful GET/HEAD requests
      if (init?.method !== "POST" && init?.method !== "PATCH" && init?.method !== "DELETE" && res.ok && data.code === "success") {
        cache.set(cacheKey, { data, timestamp: Date.now() });
      }

      if (!res.ok && data.code !== "error") {
        return {
          code: "error",
          message: "Request failed",
        } as ApiResponse<T>;
      }

      return data;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, requestPromise);
  return requestPromise;
}

// Clear cache for specific key or all
export function clearApiCache(pattern?: string) {
  if (!pattern) {
    cache.clear();
  } else {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  }
}
