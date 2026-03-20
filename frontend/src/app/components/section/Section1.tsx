import Link from "next/link";
import { FaMagnifyingGlass } from "react-icons/fa6";

export const Section1 = () => {
  return (
    <>
      <div className="bg-[#000065] py-[60px]">
        <div className="contain">
          <h1 className="font-[700] text-[28px] text-white mb-[30px] text-center">887 Việc làm IT cho Developer &quot;Chất&quot;</h1>
          <form action="" className="flex gap-x-[15px] gap-y-[12px] mb-[30px] md:flex-nowrap flex-wrap">
            <select className="md:w-[240px] w-[100%] h-[56px] rounded-[4px] px-[20px] font-[500] text-[16px] text-[#121212] bg-white">
              <option value="">Tất cả</option>
              <option value="">Hà Nội</option>
              <option value="">Đà Nẵng</option>
              <option value="">Hồ Chí Minh</option>
            </select>
            <input type="text" className="flex-1 h-[56px] rounded-[4px] px-[20px] font-[500] text-[16px] text-[#121212] bg-white" placeholder="Nhập từ khoá..." />
            <button className="md:w-[240px] w-[100%] h-[56px] bg-primary rounded-[4px] text-white font-[500] text-[16px] flex items-center justify-center">
              <FaMagnifyingGlass className="text-[20px] mr-[5px]" /> Tìm Kiếm
            </button>
          </form>
          <div className="flex gap-x-[12px] gap-y-[15px] items-center flex-wrap">
            <div className="font-[500] text-[16px] text-[#DEDEDE]">Mọi người đang tìm kiếm:</div>
            <div className="flex flex-wrap gap-[10px]">
              <Link
                href=""
                className="rounded-[20px] bg-[#121212] hover:bg-[#414042] border-[1px] border-[#414042] py-[8px] px-[22px] font-[500] text-[16px] text-[#DEDEDE] hover:text-[#FFFFFF] inline-block"
              >
                ReactJS
              </Link>
              <Link
                href=""
                className="rounded-[20px] bg-[#121212] hover:bg-[#414042] border-[1px] border-[#414042] py-[8px] px-[22px] font-[500] text-[16px] text-[#DEDEDE] hover:text-[#FFFFFF] inline-block"
              >
                Javascript
              </Link>
              <Link
                href=""
                className="rounded-[20px] bg-[#121212] hover:bg-[#414042] border-[1px] border-[#414042] py-[8px] px-[22px] font-[500] text-[16px] text-[#DEDEDE] hover:text-[#FFFFFF] inline-block"
              >
                NodeJS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
