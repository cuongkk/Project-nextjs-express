"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AuthInfo = {
  isLogin: boolean;
  infoUser: any;
  infoCompany: any;
  isAuthLoaded: boolean;
};

const AuthContext = createContext<AuthInfo | undefined>(undefined);

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
          setState({
            isLogin: true,
            infoUser: data.infoUser ?? null,
            infoCompany: data.infoCompany ?? null,
            isAuthLoaded: true,
          });
        } else {
          setState({ isLogin: false, infoUser: null, infoCompany: null, isAuthLoaded: true });
        }
      })
      .catch(() => {
        setState({ isLogin: false, infoUser: null, infoCompany: null, isAuthLoaded: true });
      });
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
};
