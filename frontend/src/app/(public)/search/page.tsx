import { SectionJob } from "@/components/features/application/SectionJob";
import { SectionSearch } from "@/components/features/application/SectionSearch";

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
