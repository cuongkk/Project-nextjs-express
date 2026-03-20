/* eslint-disable @next/next/no-img-element */
import { Section1 } from "@/app/components/section/Section1";
import Link from "next/link";
import { FaBriefcase, FaLocationDot, FaUserTie } from "react-icons/fa6";

export default function Page() {
  return (
    <>
      {/* Section 1 */}
      <Section1 />
      {/* End Section 1 */}

      {/* Kết quả tìm kiếm */}
      <div className="py-[60px]">
        <div className="contain">
          <h2 className="mb-[30px] font-[700] text-[28px] text-[#121212]">
            76 việc làm <span className="text-primary">reactjs</span>
          </h2>
          <div className="py-[10px] px-[20px] rounded-[8px] flex flex-wrap gap-[12px] mb-[30px]" style={{ boxShadow: "0px 4px 20px 0px #0000000F" }}>
            <select className="h-[36px] border-[1px] border-[#DEDEDE] rounded-[20px] px-[18px] font-[400] text-[16px] text-[#414042]">
              <option value="">Cấp bậc</option>
              <option value="">Intern</option>
              <option value="">Fresher</option>
              <option value="">Junior</option>
              <option value="">Middle</option>
              <option value="">Senior</option>
              <option value="">Manager</option>
            </select>
            <select className="h-[36px] border-[1px] border-[#DEDEDE] rounded-[20px] px-[18px] font-[400] text-[16px] text-[#414042]">
              <option value="">Hình thức làm việc</option>
              <option value="">Tại văn phòng</option>
              <option value="">Làm từ xa</option>
              <option value="">Linh hoạt</option>
            </select>
          </div>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
            <div className="rounded-[8px] border-[1px] border-[#DEDEDE] card-item relative overflow-hidden">
              <img src="/assets/images/card-bg.png" alt="" className="absolute top-0 left-0 w-[100%]" />
              <div className="p-[20px] relative">
                <div className="w-[116px] aspect-[1/1] rounded-[8px] bg-white mb-[20px] p-[10px] inner-image mx-auto">
                  <Link href="#">
                    <img src="/assets/images/demo-cong-ty-1.png" alt="" className="w-[100%] h-[100%] object-contain" />
                  </Link>
                </div>
                <h3 className="font-[700] text-[18px] text-center line-clamp-2 mb-[6px]">
                  <Link href="#" className="text-[#121212]">
                    LG Electronics Development Vietnam (LGEDV)
                  </Link>
                </h3>
                <div className="font-[400] text-[14px] text-[#121212] mb-[12px] text-center">LG CNS Việt Nam</div>
                <div className="font-[600] text-[16px] text-primary mb-[6px] text-center">1.000$ - 1.500$</div>
                <div className="font-[400] text-[14px] text-[#121212] mb-[6px] text-center">
                  <FaUserTie className="text-[16px] mr-[4px]" /> Fresher
                </div>
                <div className="font-[400] text-[14px] text-[#121212] mb-[6px] text-center">
                  <FaBriefcase className="text-[16px] mr-[4px]" /> Tại văn phòng
                </div>
                <div className="font-[400] text-[14px] text-[#121212] mb-[12px] text-center">
                  <FaLocationDot className="text-[16px] mr-[4px]" /> Ha Noi
                </div>
                <div className="flex items-center justify-center gap-[8px]">
                  <span className="border border-[#DEDEDE] rounded-[20px] py-[6px] px-[16px] font-[400] text-[12px] text-[#414042] inline-block">ReactJS</span>
                  <span className="border border-[#DEDEDE] rounded-[20px] py-[6px] px-[16px] font-[400] text-[12px] text-[#414042] inline-block">NextJS</span>
                </div>
              </div>
            </div>
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
      {/* Hết Kết quả tìm kiếm */}
    </>
  );
}
