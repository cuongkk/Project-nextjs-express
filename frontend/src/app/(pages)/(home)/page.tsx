/* eslint-disable @next/next/no-img-element */
import { Section1 } from "@/app/components/section/Section1";
import { Section2 } from "./Section2";

import Link from "next/link";
import { FaUserTie } from "react-icons/fa6";

export default function Home() {
  return (
    <>
      {/* Section 1 */}
      <Section1 />
      {/* End Section 1 */}

      {/* Section 2 */}
      <Section2 />

      {/* End Section 2 */}
    </>
  );
}
