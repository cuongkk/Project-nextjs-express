/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthContext } from "@/contexts/AuthContext";

export const useAuth = () => {
  const { isLogin, infoUser, infoCompany, isAuthLoaded } = useAuthContext();

  return {
    isLogin,
    infoUser,
    infoCompany,
    isAuthLoaded,
  };
};
