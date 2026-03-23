/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { positionList, workingFormList } from "@/configs/variable";
import Link from "next/link";
import { FaBriefcase, FaLocationDot, FaUserTie } from "react-icons/fa6";

export const JobItem = (props: { item: any }) => {
  const { item } = props;

  const position = positionList.find((pos: any) => pos.value === item.position);
  const workingForm = workingFormList.find((work: any) => work.value === item.workingForm);

  return (
    <>
      <div className="rounded-[8px] border-[1px] border-[#DEDEDE] card-item relative overflow-hidden h-[125px] pointer-coarse">
        <div className="p-[10px] flex flex-col gap-y-[5px]">
          <div className=" flex flex-row items-center gap-x-[20px]">
            <div className="h-[64px] aspect-[1/1] rounded-[8px] bg-white p-[2px] inner-image text-left">
              <Link href={`/job/detail/${item.id}`}>
                <img src={item.companyLogo} alt={item.title} className="w-[100%] h-[100%] object-contain" />
              </Link>
            </div>
            <div className="flex-1 h-[100%] flex flex-col items-start">
              <h3 className="font-[700] text-[16px] text-center mb-[6px]">
                <Link
                  href={`/job/detail/${item.id}`}
                  className="text-[#121212] block"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {item.title}
                </Link>
              </h3>
              <div className="font-[400] text-[12px] text-[#121212] mb-[12px] text-center">{item.companyName}</div>
            </div>
          </div>
          <div className="flex flex-row items-center gap-x-[12px]">
            <div className="rounded-[10px] border-[1px] border-[#DEDEDE] p-[4px] font-[600] text-[14px] text-[#121212] mb-[8px] text-center">
              {item.salaryMin.toLocaleString("vi-VN")} - {item.salaryMax.toLocaleString("vi-VN")} triệu
            </div>
            <div className="rounded-[10px] border-[1px] border-[#DEDEDE] p-[4px] font-[600] text-[14px] text-[#121212] mb-[8px] text-center"> {item.companyCity}</div>
          </div>
        </div>
      </div>
    </>
  );
};
