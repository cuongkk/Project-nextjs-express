/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { CheckBox } from "@/components/ui/CheckBox";
import { useState } from "react";
import { setReloadToast, showReloadToastIfAny } from "@/utils/toast";
import { mutate } from "swr/_internal";

export const LoginForm = () => {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    const dataFinal = {
      email: data.email,
      password: data.password,
      rememberMe: checked || false,
    };

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataFinal),
      credentials: "include",
    })
      .then((res) => res.json())
      .then(async (result) => {
        if (result.code === "error") {
          setReloadToast(result.code, result.message);
          showReloadToastIfAny();
        }

        if (result.code === "success") {
          await mutate(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`);
          setReloadToast(result.code, result.message);
          router.push("/");
        }
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit) as any} className="grid grid-cols-1 gap-y-[15px]" id="loginForm">
        <div>
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
        <div>
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
        <div>
          <button type="submit" className="bg-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white">
            Đăng nhập
          </button>
        </div>
        <div className="flex flex-direction-row items-center justify-between">
          <div>
            <CheckBox checked={checked} onChange={setChecked} />
            <span className="font-[500] text-[14px] text-black">Ghi nhớ đăng nhập</span>
          </div>
          <Link href="/forgotpassword">
            <div className="font-[500] text-[14px] text-[#0088FF]">Quên mật khẩu?</div>
          </Link>
        </div>
      </form>
    </>
  );
};
