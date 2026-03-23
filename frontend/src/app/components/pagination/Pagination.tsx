"use client";

interface PaginationProps {
  totalPage: number;
  page: number;
  onChange: (page: number) => void;
}

export const Pagination = ({ totalPage, page, onChange }: PaginationProps) => {
  if (totalPage <= 1) return null;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!Number.isNaN(value)) {
      onChange(value);
    }
  };

  return (
    <div className="mt-[30px]">
      <select className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]" onChange={handleChange} value={page}>
        {Array(totalPage)
          .fill("")
          .map((_, index) => (
            <option value={index + 1} key={index}>
              Trang {index + 1}
            </option>
          ))}
      </select>
    </div>
  );
};
