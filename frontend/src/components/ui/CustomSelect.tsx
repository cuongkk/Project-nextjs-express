import { ChevronDown } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  defaultName: string;
  name: string;
  options: Option[];
  defaultValue?: string;
};

export const CustomSelect = ({ defaultName, name, options, defaultValue = "" }: SelectProps) => {
  return (
    <div className="relative w-full md:w-[200px]">
      <select
        name={name}
        defaultValue={defaultValue}
        className="
          w-full h-[40px]
          rounded-[6px]
          px-[16px] pr-[40px]
          font-[500] text-[15px]
          text-[#121212]
          bg-white
          border border-[#DEDEDE]
          appearance-none
          outline-none
          transition-all duration-200

          hover:border-gray-400
          focus:border-blue-500
          focus:ring-2 focus:ring-blue-100
        "
      >
        <option value="">{defaultName}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Arrow */}
      <ChevronDown
        size={18}
        className="
          absolute right-3 top-1/2 -translate-y-1/2
          text-gray-500
          pointer-events-none
          transition-transform duration-200
        "
      />
    </div>
  );
};
