/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [infoUser, setInfoUser] = useState<any>(null);
  const [infoCompany, setInfoCompany] = useState<any>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check`, {
      credentials: "include", // Gửi kèm cookie
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "error") {
          console.log("useAuth /auth/check error:", data.message);
          setIsLogin(false);
          setInfoUser(null);
          setInfoCompany(null);
          setIsAuthLoaded(true);
        }

        if (data.code == "success") {
          setIsLogin(true);
          if (data.infoUser) {
            setInfoUser(data.infoUser);
          }
          if (data.infoCompany) {
            setInfoCompany(data.infoCompany);
            setInfoUser(null);
          }
          setIsAuthLoaded(true);
        }
      })
      .catch((error) => {
        console.error("useAuth /auth/check error:", error);
        setIsLogin(false);
        setInfoUser(null);
        setInfoCompany(null);
        setIsAuthLoaded(true);
      });
  }, [pathname]);

  return {
    isLogin: isLogin,
    infoUser: infoUser,
    infoCompany: infoCompany,
    isAuthLoaded: isAuthLoaded,
  };
};
