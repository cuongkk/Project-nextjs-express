"use client";

import { useEffect } from "react";

const APP_NAME = "IT Job";

export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | ${APP_NAME}`;
  }, [title]);
};
