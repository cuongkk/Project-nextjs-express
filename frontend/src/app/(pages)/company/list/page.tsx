import { CompanyItem } from "@/app/components/card/CompanyItem";

export default function Page() {
  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          <h2 className="font-[700] sm:text-[28px] text-[24px] text-[#121212] mb-[30px] text-center">Danh sách công ty</h2>
          <div className="grid lg:grid-cols-3 grid-cols-2 sm:gap-x-[20px] gap-x-[10px] gap-y-[20px]">
            <CompanyItem />
          </div>
          <div className="mt-[30px]">
            <select className="border border-[#DEDEDE] rounded-[8px] h-[44px] px-[18px] font-[400] text-[16px] text-[#414042]">
              <option value="">Trang 1</option>
              <option value="">Trang 2</option>
              <option value="">Trang 3</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
