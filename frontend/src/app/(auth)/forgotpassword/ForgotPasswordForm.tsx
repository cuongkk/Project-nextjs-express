/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";

export const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: data.email }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === "error") {
          toast.error(result.message);
        }

        if (result.code === "success") {
          toast.success(result.message);
        }
      });
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <form onSubmit={handleSubmit(onSubmit) as any} className="grid grid-cols-1 gap-y-[15px]">
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
          <button type="submit" className="bg-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white">
            Gửi yêu cầu
          </button>
        </div>
      </form>
    </>
  );
};
