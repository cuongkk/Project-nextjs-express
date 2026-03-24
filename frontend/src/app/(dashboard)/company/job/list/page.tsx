/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { JobList } from "./JobList";

export default function Page() {
  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          <div className="flex flex-wrap gap-[20px] items-center justify-between mb-[20px]">
            <h2 className="font-[700] sm:text-[28px] text-[24px] sm:w-auto w-[100%] text-[#121212]">Quản lý công việc</h2>
            <Link href="/company-manage/job/create" className="bg-[#0088FF] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]">
              Thêm mới
            </Link>
          </div>

          <JobList />
        </div>
      </div>
    </>
  );
}
