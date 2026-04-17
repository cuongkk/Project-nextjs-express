/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
export const ForgotPasswordForm = () => {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [otpSent, setOtpSent] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const emailValue = watch("email");
  const passwordValue = watch("newPassword");

  const handleSendOtp = (data: any) => {
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
          return;
        }

        toast.success(result.message);
        setOtpSent(true);
      })
      .catch(() => {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      });
  };

  const handleVerifyEmail = (data: any) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailValue,
        otp: data.otp,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === "error") {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        setStep(3);
      })
      .catch(() => {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      });
  };

  const handleResetPassword = (data: any) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailValue,
        newPassword: data.newPassword,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === "error") {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        router.push("/login");
      })
      .catch(() => {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      });
  };

  return (
    <>
      <Toaster richColors position="top-right" toastOptions={{ duration: 1000 }} />

      {step === 1 && (
        <form onSubmit={handleSubmit(handleSendOtp) as any} className="grid grid-cols-1 gap-y-[15px]">
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

          {otpSent && (
            <div>
              <label className="block font-[500] text-[14px] text-black mb-[5px]">Mã OTP *</label>

              <div className="flex gap-[10px]">
                <input
                  type="text"
                  maxLength={6}
                  className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black tracking-[4px]"
                  {...register("otp", {
                    required: "Vui lòng nhập mã OTP!",
                  })}
                />

                <button type="button" onClick={handleSubmit(handleVerifyEmail) as any} className="bg-[#0088FF] rounded-[4px] px-[20px] font-[700] text-[14px] text-white">
                  Xác nhận
                </button>
              </div>

              {errors.otp && <p className="text-red-500 text-[13px] mt-[4px]">{errors.otp.message as string}</p>}
            </div>
          )}
          <div>
            <button type="submit" className="bg-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white">
              Gửi mã OTP
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit(handleResetPassword) as any} className="grid grid-cols-1 gap-y-[15px]">
          <div>
            <label className="block font-[500] text-[14px] text-black mb-[5px]">Mật khẩu mới *</label>
            <input
              type="password"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              {...register("newPassword", {
                required: "Vui lòng nhập mật khẩu mới!",
                minLength: { value: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
              })}
            />
            {errors.newPassword && <p className="text-red-500 text-[13px] mt-[4px]">{errors.newPassword.message as string}</p>}
          </div>

          <div>
            <label className="block font-[500] text-[14px] text-black mb-[5px]">Nhập lại mật khẩu *</label>
            <input
              type="password"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              {...register("confirmPassword", {
                validate: (value) => value === passwordValue || "Mật khẩu không khớp!",
              })}
            />
            {errors.confirmPassword && <p className="text-red-500 text-[13px] mt-[4px]">{errors.confirmPassword.message as string}</p>}
          </div>

          <div>
            <button type="submit" className="bg-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white">
              Đặt lại mật khẩu
            </button>
          </div>
        </form>
      )}
    </>
  );
};
