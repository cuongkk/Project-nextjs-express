/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CompanyItem } from "@/app/components/card/CompanyItem";
import { useEffect, useState } from "react";

export const Section2 = () => {
  const [companyList, setCompanyList] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/list?limitItems=12`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          setCompanyList(data.companyList);
        }
      });
  }, []);

  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          <h2 className="font-[700] sm:text-[28px] text-[24px] text-[#121212] mb-[30px] text-center">Nhà tuyển dụng hàng đầu</h2>
          <div className="grid lg:grid-cols-3 grid-cols-2 sm:gap-x-[20px] gap-x-[10px] gap-y-[20px]">
            {companyList.map((item) => (
              <CompanyItem item={item} key={item.id} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
