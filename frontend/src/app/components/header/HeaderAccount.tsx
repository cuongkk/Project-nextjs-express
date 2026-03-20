import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export const HeaderAccount = () => {
  const { isLogin, infoUser, infoCompany } = useAuth();
  const router = useRouter();

  const handleLogout = (url: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      credentials: "include", // Gửi kèm cookie
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          router.push(url);
        }
      });
  };

  return (
    <>
      {isLogin ? (
        <>
          {/* Đã đăng nhập user */}
          {infoUser && (
            <div className="font-[600] sm:text-[16px] text-[12px] text-white relative group/sub-1">
              <Link className="" href="/user-manage/profile">
                {infoUser?.fullName || "Tài khoản"}
              </Link>
              <ul className="bg-[#000065] rounded-[4px] absolute top-[100%] right-0 w-[200px] hidden group-hover/sub-1:block">
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <Link className="font-[600] text-[16px] text-white" href="/user-manage/profile">
                    Thông tin cá nhân
                  </Link>
                </li>
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <Link className="font-[600] text-[16px] text-white" href="/user-manage/cv/list">
                    Quản lý CV
                  </Link>
                </li>
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <button className="font-[600] text-[16px] text-white" onClick={() => handleLogout("/user/login")}>
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Đã đăng nhập tài khoản company */}
          {infoCompany && (
            <div className="font-[600] sm:text-[16px] text-[12px] text-white relative group/sub-1">
              <Link className="" href="/company-manage/profile">
                {infoCompany.companyName}
              </Link>
              <ul className="bg-[#000065] rounded-[4px] absolute top-[100%] right-0 w-[200px] hidden group-hover/sub-1:block">
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <Link className="font-[600] text-[16px] text-white" href="/company-manage/profile">
                    Thông tin công ty
                  </Link>
                </li>
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <Link className="font-[600] text-[16px] text-white" href="/company-manage/job/list">
                    Quản lý công việc
                  </Link>
                </li>
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <Link className="font-[600] text-[16px] text-white" href="/company-manage/cv/list">
                    Quản lý CV
                  </Link>
                </li>
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <button className="font-[600] text-[16px] text-white cursor-pointer" onClick={() => handleLogout("/company/login")}>
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Chưa đăng nhập */}
          <div className="font-[600] sm:text-[16px] text-[12px] text-white">
            <Link href="/user/login" className="">
              Đăng Nhập
            </Link>
            <span className=""> / </span>
            <Link href="/user/register" className="">
              Đăng Ký
            </Link>
          </div>
        </>
      )}
    </>
  );
};
