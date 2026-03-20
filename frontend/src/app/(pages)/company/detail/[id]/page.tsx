import Link from "next/link";
import { FaBriefcase, FaLocationDot, FaUserTie } from "react-icons/fa6";

/* eslint-disable @next/next/no-img-element */
export default function Page() {
  return (
    <>
      <div className="pt-[30px] pb-[60px]">
        <div className="contain">
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
            <div className="flex items-start gap-[16px] sm:flex-row flex-col">
              <img alt="" className="w-[100px] aspect-square rounded-[4px] object-cover" src="/assets/images/demo-cong-ty-2.png" />
              <div className="flex-1">
                <div className="font-[700] text-[28px] text-[#121212] mb-[10px]">LG CNS Việt Nam</div>
                <div className="flex gap-[8px] items-center font-[400] text-[14px] text-[#121212]">
                  <FaLocationDot className="text-[16px]" /> Tầng 15, tòa Keangnam Landmark 72, Mễ Trì, Nam Tu Liem, Ha Noi
                </div>
              </div>
            </div>
            <div className="mt-[20px] flex flex-col gap-[10px]">
              <div className="flex gap-[5px] flex-wrap">
                <div className="font-[400] text-[16px] text-[#A6A6A6]">Mô hình công ty:</div>
                <div className="font-[400] text-[16px] text-[#121212]">Sản phẩm</div>
              </div>
              <div className="flex gap-[5px] flex-wrap">
                <div className="font-[400] text-[16px] text-[#A6A6A6]">Quy mô công ty:</div>
                <div className="font-[400] text-[16px] text-[#121212]">151 - 300 nhân viên</div>
              </div>
              <div className="flex gap-[5px] flex-wrap">
                <div className="font-[400] text-[16px] text-[#A6A6A6]">Thời gian làm việc:</div>
                <div className="font-[400] text-[16px] text-[#121212]">Thứ 2 - Thứ 6</div>
              </div>
              <div className="flex gap-[5px] flex-wrap">
                <div className="font-[400] text-[16px] text-[#A6A6A6]">Làm việc ngoài giờ:</div>
                <div className="font-[400] text-[16px] text-[#121212]">Không có OT</div>
              </div>
            </div>
          </div>
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">Mô tả chi tiết</div>
          <div className="mt-[30px]">
            <h2 className="font-[700] text-[28px] text-[#121212] mb-[20px]">Công ty có 6 việc làm</h2>
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
              <div className="rounded-[8px] border-[1px] border-[#DEDEDE] card-item relative overflow-hidden">
                <img alt="" className="absolute top-0 left-0 w-[100%]" src="/assets/images/card-bg.png" />
                <div className="p-[20px] relative">
                  <div className="w-[116px] aspect-[1/1] rounded-[8px] bg-white mb-[20px] p-[10px] inner-image mx-auto">
                    <Link href="#">
                      <img alt="" className="w-[100%] h-[100%] object-contain" src="/assets/images/demo-cong-ty-1.png" />
                    </Link>
                  </div>
                  <h3 className="font-[700] text-[18px] text-center line-clamp-2 mb-[6px]">
                    <Link className="text-[#121212]" href="#">
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
          </div>
        </div>
      </div>
    </>
  );
}
