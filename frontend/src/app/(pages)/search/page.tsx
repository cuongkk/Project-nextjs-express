import { SectionJob } from "@/app/components/section/SectionJob";
import { SectionSearch } from "@/app/components/section/SectionSearch";

export default function Page() {
  return (
    <>
      {/* Section 1 */}
      <SectionSearch />
      {/* End Section 1 */}

      {/* Kết quả tìm kiếm */}
      <SectionJob />
      {/* Hết Kết quả tìm kiếm */}
    </>
  );
}
