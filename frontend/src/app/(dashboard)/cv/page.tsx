"use client";

import { CompanyCvList } from "../../../components/features/company/CompanyCvList";
import { UserCvList } from "../../../components/features/user/UserCvList";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/* eslint-disable @next/next/no-img-element */
export default function Page() {
  const router = useRouter();
  const { infoUser, infoCompany, isLogin, isAuthLoaded } = useAuth();

  const role: "user" | "company" | null = infoCompany ? "company" : infoUser ? "user" : null;

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!isLogin || !role) {
      router.replace("/auth/login");
    }
  }, [isAuthLoaded, isLogin, role, router]);

  if (!isAuthLoaded || !isLogin || !role) {
    return null;
  }

  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          <h2 className="font-[700] sm:text-[28px] text-[24px] sm:w-auto w-[100%] text-[#121212] mb-[20px]">{role === "company" ? "Quản lý CV" : "Quản lý CV đã gửi"}</h2>
          {role === "company" ? <CompanyCvList /> : <UserCvList />}
        </div>
      </div>
    </>
  );
}
