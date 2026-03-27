"use client";

import { toast } from "sonner";

type ToastType = "success" | "error" | "info";

interface PendingToast {
  type: ToastType;
  message: string;
}

const STORAGE_KEY = "pending-toast";

export const setReloadToast = (type: ToastType, message: string) => {
  if (typeof window === "undefined") return;
  const payload: PendingToast = { type, message };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
};

export const showReloadToastIfAny = () => {
  if (typeof window === "undefined") return;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  localStorage.removeItem(STORAGE_KEY);

  try {
    const data = JSON.parse(raw) as PendingToast;
    if (!data?.message) return;

    switch (data.type) {
      case "success":
        toast.success(data.message);
        break;
      case "error":
        toast.error(data.message);
        break;
      default:
        toast(data.message);
    }
  } catch {
    // ignore parse error
  }
};
