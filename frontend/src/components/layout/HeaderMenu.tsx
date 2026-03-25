import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";

export const HeaderMenu = (props: { showMenu: boolean }) => {
  const { showMenu } = props;
  const { isLogin, isAuthLoaded } = useAuth();
  const menuList = [
    {
      name: "Việc Làm IT",
      link: "#",
      isLogin: undefined,
      children: [
        {
          name: "Việc làm IT theo kỹ năng",
          link: "#",
          children: [
            {
              name: "ReactJS",
              link: `/search?language=ReactJS`,
              children: null,
            },
            {
              name: "PHP",
              link: `/search?language=PHP`,
              children: null,
            },
            {
              name: "NodeJS",
              link: `/search?language=NodeJS`,
              children: null,
            },
          ],
        },
        {
          name: "Việc làm IT theo thành phố",
          link: "#",
          children: [
            {
              name: "Hà Nội",
              link: `/search?city=Hà Nội`,
              children: null,
            },
            {
              name: "Đà Nẵng",
              link: `/search?city=Đà Nẵng`,
              children: null,
            },
            {
              name: "Hải Phòng",
              link: `/search?city=Hải Phòng`,
              children: null,
            },
          ],
        },
      ],
    },
    {
      name: "Top Công Ty IT",
      link: "/company/list",
      isLogin: undefined,

      children: [
        {
          name: "FPT Software",
          link: `/search?company=FPT Software`,
          children: null,
        },
        {
          name: "Techcombank",
          link: `/search?company=Techcombank`,
          children: null,
        },
        {
          name: "MBBank",
          link: `/search?company=MBBank`,
          children: null,
        },
      ],
    },
    {
      name: "Nhà Tuyển Dụng",
      link: "#",
      isLogin: false,

      children: [
        {
          name: "Đăng Nhập",
          link: "/auth/login",
          children: null,
        },
        {
          name: "Đăng Ký",
          link: "/auth/register",
          children: null,
        },
      ],
    },
  ];
  return (
    <>
      <nav className={"lg:block " + (showMenu ? "fixed top-0 left-0 w-[280px] h-full bg-[#000065] z-50" : "hidden")}>
        <ul className="flex lg:flex-row flex-col gap-y-[10px] flex-wrap">
          {menuList.map((item, index) => {
            return (
              <li
                key={index}
                className={"flex items-center relative group/sub-1 flex-wrap lg:p-[10px] p-0 lg:w-auto w-full " + (item.isLogin !== undefined && item.isLogin !== isLogin ? "hidden" : "")}
              >
                <Link href={item.link} className="font-[600] text-[16px] text-white lg:flex-none flex-1">
                  {item.name}
                </Link>
                {item.children && <FaAngleDown className="text-[16px] text-white" />}
                {item.children && (
                  <ul className="bg-[#000065] rounded-[4px] lg:absolute relative lg:top-[100%] top-0 left-0 lg:w-[280px] w-full hidden group-hover/sub-1:block z-10">
                    {" "}
                    {item.children.map((menuSub1, indexSub1) => (
                      <li key={indexSub1} className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                        <Link href={menuSub1.link} className="font-[600] text-[16px] text-white">
                          {menuSub1.name}
                        </Link>
                        {menuSub1.children && <FaAngleRight className="text-[16px] text-white" />}
                        {menuSub1.children && (
                          <ul className="bg-[#000065] rounded-[4px] absolute top-0 left-[100%] w-[280px] hidden group-hover/sub-2:block">
                            {menuSub1.children.map((menuSub2, indexSub2) => (
                              <li key={indexSub2} className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px]">
                                <Link href={menuSub2.link} className="font-[600] text-[16px] text-white">
                                  {menuSub2.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};
