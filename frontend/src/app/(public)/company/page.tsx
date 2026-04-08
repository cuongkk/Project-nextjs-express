import { CompanyItem } from "@/components/features/company/CompanyItem";
import { CompnayList } from "../../../components/features/company/CompanyList";

export default function Page() {
  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          <h2 className="font-[700] sm:text-[28px] text-[24px] text-[#121212] mb-[30px] text-center">Danh sách công ty</h2>
          <CompnayList />
        </div>
      </div>
    </>
  );
}
