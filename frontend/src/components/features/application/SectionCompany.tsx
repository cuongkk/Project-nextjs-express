"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { CompanyItem } from "@/components/features/company/CompanyItem";

export const SectionCompany = () => {
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies?limitItems=6&page=1`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success" && Array.isArray(data.companyList)) {
          const mapped = data.companyList.map((item: any) => ({
            id: item.id,
            logo: item.logo,
            companyName: item.companyName,
            city: item.cityName,
            jobCount: item.totalJob,
          }));
          setCompanies(mapped);
        }
      })
      .catch(() => {
        // ignore
      });
  }, []);

  if (!companies.length) return null;

  return (
    <section className="py-[60px] bg-[#F7F7F7]">
      <div className="contain">
        <div className="flex items-end justify-between mb-[24px] gap-[12px] flex-wrap">
          <div>
            <h2 className="font-[700] sm:text-[24px] text-[20px] text-[#121212] mb-[4px]">Công ty nổi bật</h2>
            <p className="text-[14px] text-[#6B6B6B]">Khám phá những nhà tuyển dụng hàng đầu trên ITJobs.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[20px]">
          {companies.map((item) => (
            <CompanyItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};
