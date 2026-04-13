"use client";

import useSWR from "swr";
import { apiRequest } from "@/utils/api";

export function useFetch<T = unknown>(path: string, deps: unknown[] = []) {
  const fetcher = async (url: string) => {
    const result = await apiRequest<T>(url);
    if (result.code === "success") {
      return result as T;
    }
    throw new Error(result.message || "Request failed");
  };

  // Create a stable key based on path and deps
  const key = deps.length > 0 ? `${path}-${JSON.stringify(deps)}` : path;

  const { data, error, isLoading, mutate } = useSWR(key, () => fetcher(path), {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // Deduplicate requests for 60 seconds
  });

  return {
    data: data || null,
    loading: isLoading,
    error: error?.message || null,
    setData: (newData: T | null) => {
      if (newData) {
        mutate(newData, false);
      }
    },
    mutate,
  };
}
