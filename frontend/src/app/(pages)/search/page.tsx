import { Section1 } from "@/app/components/section/Section1";
import { SectionSearch } from "./SectionSearch";

export default function Page() {
  return (
    <>
      {/* Section 1 */}
      <Section1 />
      {/* End Section 1 */}

      {/* Kết quả tìm kiếm */}

      <SectionSearch />
      {/* Hết Kết quả tìm kiếm */}
    </>
  );
}
