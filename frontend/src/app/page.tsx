/* eslint-disable @next/next/no-img-element */
import { SectionSearch } from "@/components/features/application/SectionSearch";
import { SectionJob } from "@/components/features/application/SectionJob";
import ToastProvider from "../components/ui/ToastProvider";

export default function Home() {
  return (
    <>
      <ToastProvider />

      {/* Section 1 */}
      <SectionSearch />
      {/* End Section 1 */}

      {/* Section 2 */}
      <SectionJob />
      {/* End Section 2 */}
    </>
  );
}
