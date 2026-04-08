/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionSearch } from "@/components/features/application/SectionSearch";
import { SectionJob } from "@/components/features/application/SectionJob";
import { SectionCompany } from "@/components/features/application/SectionCompany";
import ToastProvider from "../components/ui/ToastProvider";

export const metadata: Metadata = {
  title: "Trang chủ",
  description: "Trang chủ của website tuyển dụng IT",
};

export default function Home() {
  return (
    <>
      <ToastProvider />
      {/* Section 1 */}
      <Suspense
        fallback={
          <div className="bg-[#000065] py-[60px]">
            <div className="contain text-white">Đang tải tìm kiếm...</div>
          </div>
        }
      >
        <SectionSearch />
      </Suspense>
      {/* End Section 1 */}
      {/* Section 2 */}
      <Suspense fallback={<div className="contain py-[40px]">Đang tải danh sách việc làm...</div>}>
        <SectionJob />
      </Suspense>
      {/* End Section 2 */}
      {/* Section 3: Featured companies */}
      <SectionCompany />
      {/* End Section 3 */}
    </>
  );
}
