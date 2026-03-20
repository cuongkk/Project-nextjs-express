/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";

export const FormRegister = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    const dataFinal = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    };

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataFinal),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === "error") {
          toast.error(result.message);
        }

        if (result.code === "success") {
          toast.success(result.message);
          router.push("/user/login");
        }
      });
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <form onSubmit={handleSubmit(onSubmit) as any} className="grid grid-cols-1 gap-y-[15px]" id="formRegister">
        <div className="">
          <label htmlFor="fullName" className="block font-[500] text-[14px] text-black mb-[5px]">
            Họ tên *
          </label>
          <input
            id="fullName"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            {...register("fullName", {
              required: "Vui lòng nhập họ tên!",
              minLength: { value: 5, message: "Vui lòng nhập ít nhất 5 ký tự!" },
              maxLength: { value: 50, message: "Vui lòng nhập tối đa 50 ký tự!" },
            })}
          />
          {errors.fullName && <p className="text-red-500 text-[13px] mt-[4px]">{errors.fullName.message as string}</p>}
        </div>
        <div className="">
          <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
            Email *
          </label>
          <input
            id="email"
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
        <div className="">
          <label htmlFor="password" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mật khẩu *
          </label>
          <input
            id="password"
            type="password"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            {...register("password", {
              required: "Vui lòng nhập mật khẩu!",
              minLength: { value: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
              validate: {
                hasLower: (value) => /[a-z]/.test(value) || "Mật khẩu phải chứa ký tự thường!",
                hasUpper: (value) => /[A-Z]/.test(value) || "Mật khẩu phải chứa ký tự hoa!",
                hasNumber: (value) => /\d/.test(value) || "Mật khẩu phải chứa chữ số!",
                hasSpecial: (value) => /[^A-Za-z0-9]/.test(value) || "Mật khẩu phải chứa ký tự đặc biệt!",
              },
            })}
          />
          {errors.password && <p className="text-red-500 text-[13px] mt-[4px]">{errors.password.message as string}</p>}
        </div>
        <div className="">
          <button type="submit" className="bg-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white">
            Đăng ký
          </button>
        </div>
      </form>
    </>
  );
};
