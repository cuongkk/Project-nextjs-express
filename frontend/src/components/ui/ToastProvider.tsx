"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";
import { showReloadToastIfAny } from "../../utils/toast";

export default function ToastProvider() {
  useEffect(() => {
    showReloadToastIfAny();
  }, []);

  return <Toaster richColors position="top-right" toastOptions={{ duration: 1000 }} />;
}
