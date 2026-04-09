import type { Metadata } from "next";
import { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";

export const metadata: Metadata = {
  title: "Tìm kiếm việc làm",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="py-[60px] contain">Đang tải...</div>}>
      <SearchPageClient />
    </Suspense>
  );
}
