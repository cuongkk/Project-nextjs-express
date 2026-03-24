/* eslint-disable @next/next/no-img-element */
import { SectionSearch } from "@/components/layout/SectionSearch";
import { SectionJob } from "@/components/layout/SectionJob";

import Link from "next/link";
import { FaUserTie } from "react-icons/fa6";

export default function Home() {
  return (
    <>
      {/* Section 1 */}
      <SectionSearch />
      {/* End Section 1 */}

      {/* Section 2 */}
      <SectionJob />
      {/* End Section 2 */}
    </>
  );
}
