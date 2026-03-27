import Link from "next/link";
import { JobCreateForm } from "../../../../components/features/job/JobCreateForm";

export default function Page() {
  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
            <div className="flex flex-wrap gap-[20px] items-center justify-between mb-[20px]">
              <h1 className="sm:w-auto w-[100%] font-[700] text-[20px] text-black">Thêm mới công việc</h1>
              <Link href="/job" className="font-[400] text-[14px] text-[#0088FF] underline">
                Quay lại danh sách
              </Link>
            </div>
            <JobCreateForm />
          </div>
        </div>
      </div>
    </>
  );
}
