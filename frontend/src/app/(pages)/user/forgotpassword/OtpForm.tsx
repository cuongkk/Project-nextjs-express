"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";

type Props = {
  onNext?: () => void;
};

export const OtpForm = ({ onNext }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    // Với backend hiện tại, OTP được kiểm tra chung trong bước reset mật khẩu,
    // nên form này chỉ dùng để người dùng test OTP trước nếu muốn.
    toast.info("Vui lòng nhập OTP cùng mật khẩu mới ở bước 3.");
    onNext && onNext();
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <form onSubmit={handleSubmit(onSubmit) as any} className="grid grid-cols-1 gap-y-[12px]">
        <h2 className="font-[600] text-[18px] mb-[4px]">Bước 2: (Tuỳ chọn) Kiểm tra OTP</h2>
        <div>
          <label htmlFor="otp" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mã OTP
          </label>
          <input
            id="otp"
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
        <button type="submit" className="bg-[#6B7280] rounded-[4px] w-full h-[40px] px-[20px] font-[700] text-[14px] text-white">
          Kiểm tra OTP
        </button>
      </form>
    </>
  );
};
