"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { setReloadToast, showReloadToastIfAny } from "@/utils/toast.helper";

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

type AuthState = {
  isLogin: boolean;
  isAuthLoaded: boolean;
  infoUser: UserInfo | null;
  infoCompany: CompanyInfo | null;
};

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    isLogin: false,
    isAuthLoaded: false,
    infoUser: null,
    infoCompany: null,
  });

  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    if (pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/forgotpassword")) {
      setState((prev) => ({
        ...prev,
        isLogin: false,
        isAuthLoaded: true,
        infoUser: null,
        infoCompany: null,
      }));
      return () => {
        cancelled = true;
      };
    }

    setState((prev) => ({
      ...prev,
      isAuthLoaded: false,
    }));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((result) => {
        if (cancelled) return;
        if (result.code === "success") {
          setState({
            isLogin: true,
            isAuthLoaded: true,
            infoUser: result.infoUser ?? null,
            infoCompany: result.infoCompany ?? null,
          });
          setReloadToast(result.code, result.message);
          showReloadToastIfAny();
        } else {
          setState({
            isLogin: false,
            isAuthLoaded: true,
            infoUser: null,
            infoCompany: null,
          });
          if (result.message && result.message !== "Vui lòng đăng nhập!") {
            setReloadToast(result.code, result.message);
            showReloadToastIfAny();
          }
        }
      })
      .catch(() => {
        if (cancelled) return;
        setState({
          isLogin: false,
          isAuthLoaded: true,
          infoUser: null,
          infoCompany: null,
        });
        setReloadToast("error", "Có lỗi xảy ra khi tải thông tin người dùng.");
        showReloadToastIfAny();
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);
  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    setState({
      isLogin: false,
      isAuthLoaded: true,
      infoUser: null,
      infoCompany: null,
    });
  };

  return {
    ...state,
    logout,
  };
};
