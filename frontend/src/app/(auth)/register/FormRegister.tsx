/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { useState } from "react";
import { setReloadToast } from "@/utils/toast";

const roles = [
  { value: "user", label: "Ứng viên" },
  { value: "company", label: "Nhà tuyển dụng" },
];

export const FormRegister = () => {
  const [role, setRole] = useState<string>("user");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      role,
    };

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === "error") {
          setReloadToast(result.code, result.message);
        }

        if (result.code === "success") {
          setReloadToast(result.code, result.message);
        }
      });
  };

  return (
    <>
      <Toaster richColors position="top-right" toastOptions={{ duration: 1000 }} />
      <form onSubmit={handleSubmit(onSubmit) as any} className="grid grid-cols-1 gap-y-[15px]">
        <div>
          <label className="block font-[500] text-[14px] text-black mb-[5px]">Vai trò *</label>
          <div className="flex gap-[10px]">
            {roles.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setRole(item.value)}
                className={`flex-1 h-[40px] border rounded-[4px] text-[14px] font-[500] ${role === item.value ? "bg-primary text-white border-primary" : "border-[#DEDEDE] text-black"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-[500] text-[14px] text-black mb-[5px]">Email *</label>
          <input
            type="email"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            {...register("email", {
              required: "Vui lòng nhập email!",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Email không đúng định dạng!",
              },
            })}
          />
          {errors.email && <p className="text-red-500 text-[13px] mt-[4px]">{errors.email.message as string}</p>}
        </div>
        <div>
          <label className="block font-[500] text-[14px] text-black mb-[5px]">Mật khẩu *</label>
          <input
            type="password"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            {...register("password", {
              required: "Vui lòng nhập mật khẩu!",
            })}
          />
          {errors.password && <p className="text-red-500 text-[13px] mt-[4px]">{errors.password.message as string}</p>}
        </div>
        <div>
          <button type="submit" className="bg-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white">
            Đăng ký
          </button>
        </div>
      </form>
    </>
  );
};
