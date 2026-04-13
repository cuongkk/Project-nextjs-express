/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionSearch } from "@/components/features/application/SectionSearch";
import { HomeJobSection } from "@/components/features/application/HomeJobSection";
import { SectionCompany } from "@/components/features/application/SectionCompany";
import ToastProvider from "../components/ui/ToastProvider";

export const metadata: Metadata = {
  title: "Việc làm IT & Tuyển dụng",
  description: "Khám phá việc làm IT mới nhất, tìm công ty phù hợp và ứng tuyển nhanh.",
};

export default function Home() {
  return (
    <>
      <ToastProvider />
      <Suspense
        fallback={
          <div className="bg-[#000065] py-[60px]">
            <div className="contain text-white">Đang tải tìm kiếm...</div>
          </div>
        }
      >
        <SectionSearch />
      </Suspense>
      <Suspense fallback={<div className="contain py-[40px]">Đang tải danh sách việc làm...</div>}>
        <HomeJobSection />
        <SectionCompany />
      </Suspense>
    </>
  );
}
