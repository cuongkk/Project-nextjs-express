import { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="py-[60px] contain">Đang tải...</div>}>
      <SearchPageClient />
    </Suspense>
  );
}
