/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  fileCV: FileList;
};

export const FormApply = (props: { jobId: string }) => {
  const { jobId } = props;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    const file = data.fileCV?.[0];

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    if (file) {
      formData.append("fileCV", file);
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/apply`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === "error") {
          toast.error(result.message);
        }

        if (result.code === "success") {
          toast.success(result.message);
          reset();
        }
      });
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <form onSubmit={handleSubmit(onSubmit) as any} className="" id="applyForm">
        <div className="mb-[15px]">
          <label htmlFor="fullName" className="block font-[500] text-[14px] text-black mb-[5px]">
            Họ tên *
          </label>
          <input
            id="fullName"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] px-[20px] font-[500] text-[14px] text-black"
            {...register("fullName", {
              required: "Vui lòng nhập họ tên!",
              minLength: { value: 5, message: "Họ tên phải có ít nhất 5 ký tự!" },
              maxLength: { value: 50, message: "Họ tên không được vượt quá 50 ký tự!" },
            })}
          />
          {errors.fullName && <p className="text-red-500 text-[13px] mt-[4px]">{errors.fullName.message}</p>}
        </div>
        <div className="mb-[15px]">
          <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
            Email *
          </label>
          <input
            id="email"
            type="email"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] px-[20px] font-[500] text-[14px] text-black"
            {...register("email", {
              required: "Vui lòng nhập email của bạn!",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Email không đúng định dạng!",
              },
            })}
          />
          {errors.email && <p className="text-red-500 text-[13px] mt-[4px]">{errors.email.message}</p>}
        </div>
        <div className="mb-[15px]">
          <label htmlFor="phone" className="block font-[500] text-[14px] text-black mb-[5px]">
            Số điện thoại *
          </label>
          <input
            id="phone"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] px-[20px] font-[500] text-[14px] text-black"
            {...register("phone", {
              required: "Vui lòng nhập số điện thoại!",
              pattern: {
                value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                message: "Số điện thoại không đúng định dạng!",
              },
            })}
          />
          {errors.phone && <p className="text-red-500 text-[13px] mt-[4px]">{errors.phone.message}</p>}
        </div>
        <div className="mb-[15px]">
          <label htmlFor="fileCV" className="block font-[500] text-[14px] text-black mb-[5px]">
            File CV dạng PDF *
          </label>
          <input
            id="fileCV"
            type="file"
            accept="application/pdf"
            className=""
            {...register("fileCV", {
              required: "Vui lòng chọn file CV!",
              validate: {
                isPdf: (files: FileList) => {
                  const file = files?.[0];
                  if (!file) return "Vui lòng chọn file CV!";
                  return file.type === "application/pdf" || "File phải là định dạng PDF!";
                },
                maxSize: (files: FileList) => {
                  const file = files?.[0];
                  if (!file) return true;
                  return file.size <= 5 * 1024 * 1024 || "Dung lượng file không được vượt quá 5MB!";
                },
              },
            })}
          />
          {errors.fileCV && <p className="text-red-500 text-[13px] mt-[4px]">{errors.fileCV.message as string}</p>}
        </div>
        <button type="submit" className="w-[100%] h-[48px] rounded-[4px] bg-primary font-[700] text-[16px] text-white">
          Gửi CV ứng tuyển
        </button>
      </form>
    </>
  );
};
