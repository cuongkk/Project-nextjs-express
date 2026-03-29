"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { TechList } from "@/configs/variable";

export const SectionSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (data: any) => {
    data.preventDefault();

    const formData = new FormData(data.currentTarget);
    const city = (formData.get("city") as string) || "";
    const keyword = (formData.get("keyword") as string) || "";
    const params = new URLSearchParams(searchParams.toString());

    if (city) {
      params.set("city", city);
    } else {
      params.delete("city");
    }

    if (keyword) {
      params.set("keyword", keyword);
    } else {
      params.delete("keyword");
    }

    router.push(`/?${params.toString()}`);
  };

  const handleSearchTech = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("technologies", value);
    } else {
      params.delete("technologies");
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <>
      <div className="bg-[#000065] py-[60px]">
        <div className="contain">
          <h1 className="font-[700] text-[28px] text-white mb-[30px] text-center">887 Việc làm IT cho Developer &quot;Chất&quot;</h1>
          <form onSubmit={handleSearch} className="flex gap-x-[15px] gap-y-[12px] mb-[30px] md:flex-nowrap flex-wrap">
            <select name="city" className="md:w-[240px] w-[100%] h-[56px] rounded-[4px] px-[20px] font-[500] text-[16px] text-[#121212] bg-white">
              {" "}
              <option value="">Tất cả</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Hồ Chí Minh">Hồ Chí Minh</option>
            </select>
            <input type="text" name="keyword" className="flex-1 h-[56px] rounded-[4px] px-[20px] font-[500] text-[16px] text-[#121212] bg-white" placeholder="Nhập từ khoá..." />
            <button className="md:w-[240px] w-[100%] h-[56px] bg-primary rounded-[4px] text-white font-[500] text-[16px] flex items-center justify-center">
              <FaMagnifyingGlass className="text-[20px] mr-[5px]" /> Tìm Kiếm
            </button>
          </form>
          <div className="flex gap-x-[12px] gap-y-[15px] items-center flex-wrap">
            <div className="font-[500] text-[16px] text-[#DEDEDE]">Mọi người đang tìm kiếm:</div>
            <div className="flex flex-wrap gap-[10px]">
              {TechList.map((tech: string, index: number) => (
                <button key={index} onClick={() => handleSearchTech(tech)} className="cursor-pointer inline-block bg-[#F0F0F0] text-[#414042] text-[14px] font-[400] py-[4px] px-[8px] rounded-[8px]">
                  {tech}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
