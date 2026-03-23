"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AuthInfo = {
  isLogin: boolean;
  infoUser: any;
  infoCompany: any;
  isAuthLoaded: boolean;
};

type AuthContextValue = {
  state: AuthInfo;
  setAuth: (next: Partial<AuthInfo>) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children, initialAuth }: { children: ReactNode; initialAuth: Partial<AuthInfo> }) => {
  const [state, setState] = useState<AuthInfo>({
    isLogin: initialAuth.isLogin ?? false,
    infoUser: initialAuth.infoUser ?? null,
    infoCompany: initialAuth.infoCompany ?? null,
    isAuthLoaded: initialAuth.isAuthLoaded ?? false,
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          setState((prev) => ({
            ...prev,
            isLogin: true,
            infoUser: data.infoUser ?? null,
            infoCompany: data.infoCompany ?? null,
            isAuthLoaded: true,
          }));
        } else {
          setState((prev) => ({ ...prev, isLogin: false, infoUser: null, infoCompany: null, isAuthLoaded: true }));
        }
      })
      .catch(() => {
        setState((prev) => ({ ...prev, isLogin: false, infoUser: null, infoCompany: null, isAuthLoaded: true }));
      });
  }, []);

  const setAuth = (next: Partial<AuthInfo>) => {
    setState((prev) => ({ ...prev, ...next }));
  };

  const logout = () => {
    setState({ isLogin: false, infoUser: null, infoCompany: null, isAuthLoaded: true });
  };

  return <AuthContext.Provider value={{ state, setAuth, logout }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
};
