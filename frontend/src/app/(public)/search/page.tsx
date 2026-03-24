import { SectionJob } from "@/components/layout/SectionJob";
import { SectionSearch } from "@/components/layout/SectionSearch";

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
