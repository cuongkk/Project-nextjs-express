"use client";

import useSWR from "swr";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { clearApiCache } from "@/utils/api";

export type UserInfo = {
  fullName: string;
  email: string;
  phone?: string;
  birthday?: string;
  gender?: string;
  address?: string;
  experienceYears?: string;
  currentPosition?: string;
  desiredPosition?: string;
  skills?: string[];
  education?: string[];
  socials?: unknown;
  avatar?: string;
};

export type CompanyInfo = {
  companyName: string;
  logo?: string;
  city?: string;
  address?: string;
  companyModel?: string;
  companyEmployees?: string;
  workingTime?: string;
  workOvertime?: string;
  email?: string;
  phone?: string;
  description?: string;
};

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch");
  }
  return res.json();
};

export const useAuth = () => {
  const pathname = usePathname();

  const shouldFetch = !pathname?.startsWith("/login") && !pathname?.startsWith("/register") && !pathname?.startsWith("/forgotpassword") && !pathname?.startsWith("/changepassword");

  const { data, error, isLoading, mutate } = useSWR(shouldFetch ? `${process.env.NEXT_PUBLIC_API_URL}/auth/me` : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
    focusThrottleInterval: 600000, // Only revalidate on focus every 10 minutes
  });

  const isLogin = data?.code === "success";

  const logout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      const result = await res.json();

      if (result.code === "success") {
        toast.success(result.message);
        // Clear all cached data on logout
        clearApiCache();
      } else {
        toast.error(result.message);
      }

      mutate(null, false); // Set auth state to null
    } catch {
      toast.error("Logout thất bại!");
    }
  };

  return {
    isLogin,
    isAuthLoaded: !isLoading,
    infoUser: data?.infoUser ?? null,
    infoCompany: data?.infoCompany ?? null,
    error,
    logout,
    mutate,
  };
};
