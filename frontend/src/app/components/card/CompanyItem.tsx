import Link from "next/link";
import { FaUserTie } from "react-icons/fa6";

/* eslint-disable @next/next/no-img-element */
export const CompanyItem = () => {
  return (
    <>
      <div className="rounded-[8px] border-[1px] border-[#DEDEDE] card-item relative overflow-hidden flex flex-col">
        <img src="/assets/images/card-bg.png" alt="" className="absolute top-0 left-0 w-[100%]" />
        <div className="sm:pt-[32px] pt-[20px] sm:pb-[24px] pb-[16px] sm:px-[16px] px-[8px] relative flex-1">
          <div className="sm:w-[160px] w-[125px] aspect-[1/1] rounded-[8px] bg-white sm:mb-[24px] mb-[16px] p-[10px] inner-image mx-auto">
            <Link href="#">
              <img src="/assets/images/demo-cong-ty-1.png" alt="" className="w-[100%] h-[100%] object-contain" />
            </Link>
          </div>
          <h3 className="font-[700] sm:text-[18px] text-[14px] text-center line-clamp-2">
            <Link href="#" className="text-[#121212]">
              LG Electronics Development Vietnam (LGEDV)
            </Link>
          </h3>
        </div>
        <div className="bg-[#F7F7F7] py-[12px] sm:px-[16px] px-[6px] flex sm:justify-between justify-center items-center sm:flex-nowrap flex-wrap gap-[12px]">
          <div className="font-[400] text-[14px] text-[#414042]">Ho Chi Minh</div>
          <div className="font-[400] text-[14px] text-[#121212] flex items-center">
            <FaUserTie className="mr-[3px] text-[16px] text-[#000096]" /> 5 Việc làm
          </div>
        </div>
      </div>
    </>
  );
};
