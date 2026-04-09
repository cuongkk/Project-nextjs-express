"use client";

import { LoginForm } from "@/app/(auth)/login/LoginForm";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Page() {
  usePageTitle("Đăng nhập");

  return (
    <div className="py-[60px]">
      <div className="contain">
        <div className="border border-[#DEDEDE] rounded-[8px] py-[50px] px-[20px] max-w-[602px] mx-auto">
          <h1 className="font-[700] text-[20px] text-black text-center mb-[20px]">Đăng nhập</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
