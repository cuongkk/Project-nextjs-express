"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CompanyItem } from "@/app/components/card/CompanyItem";
import { Pagination } from "@/app/components/pagination/Pagination";
import { useEffect, useState } from "react";

export const CompnayList = () => {
  const [companyList, setCompanyList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/list?limitItems=2?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          setCompanyList(data.companyList);
          setTotalPage(data.totalPage);
        }
      });
  }, [page]);

  const handlePagination = (value: number) => {
    setPage(value);
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 grid-cols-2 sm:gap-x-[20px] gap-x-[10px] gap-y-[20px]">
        {companyList.map((item) => (
          <CompanyItem item={item} key={item.id} />
        ))}
      </div>
      <Pagination totalPage={totalPage} page={page} onChange={handlePagination} />
    </>
  );
};
