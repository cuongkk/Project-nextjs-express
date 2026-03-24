/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { CheckBox } from "@/components/ui/CheckBox";
import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import Link from "next/dist/client/link";

export const FormLogin = () => {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const { setAuth } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    const dataFinal = {
      email: data.email,
      password: data.password,
      check: checked,
    };

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataFinal),
      credentials: "include", // Gửi kèm cookie, giữ cookie
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === "error") {
          toast.error(result.message);
        }

        if (result.code === "success") {
          toast.success(result.message);
          setAuth({ isLogin: true, infoCompany: result.infoCompany ?? null, infoUser: null });
          router.push("/");
        }
      });
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <form onSubmit={handleSubmit(onSubmit) as any} className="grid grid-cols-1 gap-y-[15px]" id="loginForm">
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
            })}
          />
          {errors.password && <p className="text-red-500 text-[13px] mt-[4px]">{errors.password.message as string}</p>}
        </div>
        <div className="">
          <button type="submit" className="bg-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white">
            Đăng nhập
          </button>
        </div>
        <div className="flex flex-direction-row items-center justify-between">
          <div>
            <CheckBox checked={checked} onChange={setChecked} />
            <span className="font-[500] text-[14px] text-black">Ghi nhớ đăng nhập</span>
          </div>
          <Link href="/company/forgotpassword">
            <div className="font-[500] text-[14px] text-[#0088FF]">Quên mật khẩu?</div>
          </Link>
        </div>
      </form>
    </>
  );
};
