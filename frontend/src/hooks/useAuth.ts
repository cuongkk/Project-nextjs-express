import { useAuthContext } from "@/contexts/AuthContext";

export const useAuth = () => {
  const ctx = useAuthContext();

  return {
    ...ctx.state,
    setAuth: ctx.setAuth,
    logout: ctx.logout,
  };
};
