"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaAngleDown } from "react-icons/fa6";

type MenuItem = {
  label: string;
  query: Record<string, string>;
};

type MenuSection = {
  key: string;
  name: string;
  items: MenuItem[];
};

type MenuListProps = {
  sections: MenuSection[];
};
const buildSearchHref = (query: Record<string, string>) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  params.set("page", "1");

  return `/search?${params.toString()}`;
};

const JobMegaMenu = ({ sections, onClose }: { sections: MenuSection[]; onClose?: () => void }) => {
  if (!sections.length) return null;

  return (
    <li className="relative group flex items-center lg:p-[10px] p-[5px] bg-[#000071] cursor-pointer">
      <span className="font-[600] text-[16px] text-white flex-1 ">Công việc</span>
      <FaAngleDown className="text-white ml-1 hidden lg:block" />

      {/* Level 1 */}
      <ul className="absolute top-full left-0 w-[260px] bg-[#000065] rounded-[4px] hidden group-hover:block z-20">
        {sections.map((section) => (
          <li key={section.key} className="relative group/sub">
            <div className="flex justify-between items-center px-[16px] py-[10px] hover:bg-[#000096] text-white cursor-pointer">
              {section.name}
              <FaAngleDown className="-rotate-90" />
            </div>

            {/* Level 2 */}
            <ul className="absolute top-0 left-full w-[260px] bg-[#000065] rounded-[4px] hidden group-hover/sub:block max-h-[400px] overflow-y-auto">
              {section.items.map((item) => (
                <li key={item.label}>
                  <Link href={buildSearchHref(item.query)} className="block px-[16px] py-[10px] text-white hover:bg-[#000096]" onClick={onClose}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </li>
  );
};

const MenuList = ({ sections, onClose }: MenuListProps & { onClose?: () => void }) => {
  if (!sections.length) return null;

  return (
    <ul className="flex lg:flex-row flex-col gap-x-[16px]">
      <JobMegaMenu sections={sections} onClose={onClose} />
    </ul>
  );
};

export const HeaderMenu = (props: { showMenu: boolean; onClose: () => void }) => {
  const { showMenu, onClose } = props;
  const [sections, setSections] = useState<MenuSection[]>([]);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/all`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (data.code !== "success") return;

        const skills: MenuItem[] = (data.techList || []).map((tech: string) => ({
          label: tech,
          query: { technologies: tech },
        }));

        const cities: MenuItem[] = (data.listCity || []).map((city: { name: string }) => ({
          label: city.name,
          query: { city: city.name },
        }));

        const companies: MenuItem[] = (data.companies || []).map((company: { companyName: string }) => ({
          label: company.companyName,
          query: { company: company.companyName },
        }));

        const title: MenuItem[] = (data.title || []).map((title: string) => ({
          label: title.charAt(0).toUpperCase() + title.slice(1),
          query: { title: title },
        }));
        setSections([
          { key: "skills", name: "Công việc theo kĩ năng", items: skills },
          { key: "cities", name: "Công việc theo thành phố", items: cities },
          { key: "companies", name: "Công việc theo công ty", items: companies },
          { key: "titles", name: "Công việc theo chuyên môn", items: title },
        ]);
      } catch (error) {
        // ignore
      }
    };

    fetchMenuData();
  }, []);

  return (
    <>
      <nav className={`${showMenu ? "block" : "hidden"} lg:block bg-[#000065] lg:static ` + (showMenu ? "fixed top-0 left-0 w-[280px] h-full z-50 lg:w-auto lg:h-auto" : "")}>
        <MenuList sections={sections} onClose={onClose} />
      </nav>
    </>
  );
};
