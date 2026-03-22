"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";

type Props = {
  onSuccess?: () => void;
};

export const ForgotPasswordForm = ({ onSuccess }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/forgot-password`, {
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
          onSuccess && onSuccess();
        }
      });
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <form onSubmit={handleSubmit(onSubmit) as any} className="grid grid-cols-1 gap-y-[12px]">
        <h2 className="font-[600] text-[18px] mb-[4px]">Bước 1: Nhập email</h2>
        <div>
          <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
            Email đã đăng ký *
          </label>
          <input
            id="email"
            type="email"
            className="w-full h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
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
        <button type="submit" className="bg-[#0088FF] rounded-[4px] w-full h-[40px] px-[20px] font-[700] text-[14px] text-white">
          Gửi mã OTP
        </button>
      </form>
    </>
  );
};
