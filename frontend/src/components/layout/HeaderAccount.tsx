import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export const HeaderAccount = () => {
  const { isLogin, infoUser, infoCompany, isAuthLoaded, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };
  return (
    <>
      {isLogin ? (
        <>
          {/* Đã đăng nhập user */}
          {infoUser && (
            <div className="font-[600] sm:text-[16px] text-[12px] text-white relative group/sub-1 z-10">
              <Link className="" href="/profile">
                {infoUser?.fullName || "Tài khoản"}
              </Link>
              <ul className="bg-[#000065] rounded-[4px] absolute top-[100%] right-0 w-[200px] hidden group-hover/sub-1:block">
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <Link className="font-[600] text-[16px] text-white" href="/profile">
                    Thông tin cá nhân
                  </Link>
                </li>
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <Link className="font-[600] text-[16px] text-white" href="/changepassword">
                    Đổi mật khẩu
                  </Link>
                </li>
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <Link className="font-[600] text-[16px] text-white" href="/cv">
                    Quản lý CV
                  </Link>
                </li>
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <button className="font-[600] text-[16px] text-white" onClick={() => handleLogout()}>
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          )}
          {/* Đã đăng nhập tài khoản company */}
          {infoCompany && (
            <div className="font-[600] sm:text-[16px] text-[12px] text-white relative group/sub-1">
              <Link className="" href="/profile">
                {infoCompany.companyName}
              </Link>
              <ul className="bg-[#000065] rounded-[4px] absolute top-[100%] right-0 w-[200px] hidden group-hover/sub-1:block z-50">
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <Link className="font-[600] text-[16px] text-white" href="/profile">
                    Thông tin công ty
                  </Link>
                </li>
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <Link className="font-[600] text-[16px] text-white" href="/job">
                    Quản lý công việc
                  </Link>
                </li>
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <Link className="font-[600] text-[16px] text-white" href="/cv">
                    Quản lý CV
                  </Link>
                </li>
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <button className="font-[600] text-[16px] text-white cursor-pointer" onClick={() => handleLogout()}>
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
            <Link href="/login" className="">
              Đăng Nhập
            </Link>
            <span className=""> / </span>
            <Link href="/register" className="">
              Đăng Ký
            </Link>
          </div>
        </>
      )}
    </>
  );
};
