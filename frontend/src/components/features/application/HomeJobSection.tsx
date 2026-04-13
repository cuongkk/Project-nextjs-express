"use client";

import { SectionJob } from "@/components/features/application/SectionJob";
import { SectionPropose } from "@/components/features/application/SectionPropose";
import { useAuth } from "@/hooks/useAuth";

export const HomeJobSection = () => {
  const { isLogin, isAuthLoaded, infoUser } = useAuth();

  const shouldShowRecommend = isAuthLoaded && isLogin && !!infoUser;

  return shouldShowRecommend ? <SectionPropose /> : <SectionJob />;
};
