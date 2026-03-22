"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";

export const NewPasswordForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    const payload = {
      email: data.email,
      otp: data.otp,
      newPassword: data.newPassword,
    };

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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

  const newPassword = watch("newPassword");

  return (
    <>
      <Toaster richColors position="top-right" />
      <form onSubmit={handleSubmit(onSubmit) as any} className="grid grid-cols-1 gap-y-[12px]">
        <h2 className="font-[600] text-[18px] mb-[4px]">Bước 3: Đặt lại mật khẩu mới</h2>
        <div>
          <label htmlFor="email-reset" className="block font-[500] text-[14px] text-black mb-[5px]">
            Email đã đăng ký *
          </label>
          <input
            id="email-reset"
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
        <div>
          <label htmlFor="otp-reset" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mã OTP *
          </label>
          <input
            id="otp-reset"
            type="text"
            className="w-full h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            {...register("otp", {
              required: "Vui lòng nhập mã OTP!",
              minLength: { value: 6, message: "Mã OTP phải gồm 6 ký tự!" },
              maxLength: { value: 6, message: "Mã OTP phải gồm 6 ký tự!" },
            })}
          />
          {errors.otp && <p className="text-red-500 text-[13px] mt-[4px]">{errors.otp.message as string}</p>}
        </div>
        <div>
          <label htmlFor="newPassword" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mật khẩu mới *
          </label>
          <input
            id="newPassword"
            type="password"
            className="w-full h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            {...register("newPassword", {
              required: "Vui lòng nhập mật khẩu mới!",
              minLength: { value: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
            })}
          />
          {errors.newPassword && <p className="text-red-500 text-[13px] mt-[4px]">{errors.newPassword.message as string}</p>}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block font-[500] text-[14px] text-black mb-[5px]">
            Nhập lại mật khẩu mới *
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="w-full h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            {...register("confirmPassword", {
              required: "Vui lòng nhập lại mật khẩu mới!",
              validate: (value) => value === newPassword || "Mật khẩu nhập lại không khớp!",
            })}
          />
          {errors.confirmPassword && <p className="text-red-500 text-[13px] mt-[4px]">{errors.confirmPassword.message as string}</p>}
        </div>
        <button type="submit" className="bg-[#10B981] rounded-[4px] w-full h-[40px] px-[20px] font-[700] text-[14px] text-white">
          Đặt lại mật khẩu
        </button>
      </form>
    </>
  );
};
