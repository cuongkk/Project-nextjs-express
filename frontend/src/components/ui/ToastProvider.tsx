"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";
import { showReloadToastIfAny } from "../../utils/toast.helper";

export default function ToastProvider() {
  useEffect(() => {
    showReloadToastIfAny();
  }, []);

  return <Toaster richColors position="top-right" />;
}
