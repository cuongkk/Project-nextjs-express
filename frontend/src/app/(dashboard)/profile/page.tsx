"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { UserProfileForm } from "@/components/features/user/UserProfileForm";
import { CompanyProfileForm } from "@/components/features/company/CompanyProfileForm";

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
    <div className="py-[60px]">
      <div className="container">
        <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
          <h1 className="font-[700] text-[20px] text-black mb-[20px]">{role === "company" ? "Thông tin công ty" : "Thông tin cá nhân"}</h1>
          {role === "company" ? <CompanyProfileForm /> : <UserProfileForm />}
        </div>
      </div>
    </div>
  );
}
