import type { Metadata } from "next";
import { Suspense } from "react";
import SearchPageClient from "../search/SearchPageClient";

export const metadata: Metadata = {
  title: "Danh sách việc làm",
};

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="py-[60px] contain">Đang tải...</div>}>
      <SearchPageClient />
    </Suspense>
  );
}
