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
      <div className="rounded-[8px] border-[1px] border-[#DEDEDE] card-item relative overflow-hidden">
        <img src="/assets/images/card-bg.png" alt="" className="absolute top-0 left-0 w-[100%]" />
        <div className="p-[20px] relative">
          <div className="w-[116px] aspect-[1/1] rounded-[8px] bg-white mb-[20px] p-[10px] inner-image mx-auto">
            <Link href={`/job/detail/${item.id}`}>
              <img src={item.companyLogo} alt={item.title} className="w-[100%] h-[100%] object-contain" />
            </Link>
          </div>
          <h3 className="font-[700] text-[18px] text-center line-clamp-2 mb-[6px]">
            <Link href={`/job/detail/${item.id}`} className="text-[#121212]">
              {item.title}
            </Link>
          </h3>
          <div className="font-[400] text-[14px] text-[#121212] mb-[12px] text-center">{item.companyName}</div>
          <div className="font-[600] text-[16px] text-primary mb-[6px] text-center">
            {item.salaryMin.toLocaleString("")}$ - {item.salaryMax.toLocaleString("")}$
          </div>
          <div className="font-[400] text-[14px] text-[#121212] mb-[6px] text-center">
            <FaUserTie className="text-[16px] mr-[4px]" /> {position?.label}
          </div>
          <div className="font-[400] text-[14px] text-[#121212] mb-[6px] text-center">
            <FaBriefcase className="text-[16px] mr-[4px]" /> {workingForm?.label}
          </div>
          <div className="font-[400] text-[14px] text-[#121212] mb-[12px] text-center">
            <FaLocationDot className="text-[16px] mr-[4px]" /> {item.companyCity}
          </div>
          <div className="flex items-center justify-center flex-wrap gap-[8px]">
            {item.technologies.map((tech: any, index: number) => (
              <span className="border border-[#DEDEDE] rounded-[20px] py-[6px] px-[16px] font-[400] text-[12px] text-[#414042] inline-block" key={index}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
