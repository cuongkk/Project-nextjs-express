"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "sonner";
import { setReloadToast } from "@/utils/toast.helper";

interface ChangePassFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ChangePassForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChangePassFormValues>();

  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: ChangePassFormValues) => {
    setServerError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await res.json();

      if (result.code === "error") {
        setServerError(result.message || "Đổi mật khẩu thất bại");
        return;
      }

      if (result.code === "success") {
        setReloadToast("success", result.message || "Đổi mật khẩu thành công");
        window.location.reload();
      }
    } catch (error) {
      setServerError("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const newPassword = watch("newPassword");

  return (
    <>
      <Toaster richColors position="top-right" />

      <form onSubmit={handleSubmit(onSubmit) as any} className="max-w-[500px] space-y-[15px]">
        {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

        <div>
          <label className="block mb-[5px]">Mật khẩu hiện tại *</label>
          <input
            type="password"
            className="w-full h-[46px] border px-[20px]"
            {...register("currentPassword", {
              required: "Vui lòng nhập mật khẩu hiện tại!",
            })}
          />
          {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>}
        </div>

        <div>
          <label className="block mb-[5px]">Mật khẩu mới *</label>
          <input
            type="password"
            className="w-full h-[46px] border px-[20px]"
            {...register("newPassword", {
              required: "Vui lòng nhập mật khẩu mới!",
              minLength: { value: 6, message: "Ít nhất 6 ký tự!" },
            })}
          />
          {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
        </div>

        <div>
          <label className="block mb-[5px]">Nhập lại mật khẩu mới *</label>
          <input
            type="password"
            className="w-full h-[46px] border px-[20px]"
            {...register("confirmPassword", {
              required: "Vui lòng nhập lại mật khẩu mới!",
              validate: (value) => value === newPassword || "Mật khẩu nhập lại không khớp!",
            })}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white h-[48px] w-full disabled:opacity-60 disabled:cursor-not-allowed">
          {isSubmitting ? "Đang xử lý..." : "Đổi mật khẩu"}
        </button>
      </form>
    </>
  );
};
