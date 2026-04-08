"use client";

import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { applyTermsContent } from "@/configs/variable";
import { useState } from "react";
type FormValues = {
  fileCV: FileList | null;
  userName: string;
  email: string;
  phone: string;
  agree: boolean;
};

export const FormApply = ({ jobId }: { jobId: string }) => {
  const [showApplyTerms, setShowApplyTerms] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const files = watch("fileCV");

  const onSubmit = async (data: FormValues) => {
    const file = data.fileCV?.[0];

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("userName", data.userName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);

    if (file) {
      formData.append("fileCV", file);
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await res.json();

      if (result.code === "error") {
        toast.error(result.message);
      }

      if (result.code === "success") {
        toast.success(result.message);
        window.location.reload();
        setShowApplyTerms(false);
      }
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" toastOptions={{ duration: 1000 }} />
      <form onSubmit={handleSubmit(onSubmit) as any}>
        {/* FILE */}
        <div className="mb-[15px]">
          <label
            htmlFor="fileCV"
            className="flex flex-col items-center justify-center border-2 border-dashed p-6 rounded-lg cursor-pointer"
            onDrop={(e) => {
              e.preventDefault();
              setValue("fileCV", e.dataTransfer.files, { shouldValidate: true });
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <span>Kéo thả file hoặc bấm để chọn</span>
            <span className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Chọn tệp</span>

            <input
              id="fileCV"
              type="file"
              accept="application/pdf"
              className="hidden"
              {...register("fileCV", {
                required: "Vui lòng chọn file CV!",
                validate: {
                  isPdf: (files) => {
                    const file = files?.[0];
                    if (!file) return "Vui lòng chọn file CV!";
                    return file.type === "application/pdf" || "File phải là PDF!";
                  },
                  maxSize: (files) => {
                    const file = files?.[0];
                    if (!file) return true;
                    return file.size <= 5 * 1024 * 1024 || "File không vượt quá 5MB!";
                  },
                },
              })}
            />
          </label>

          {errors.fileCV && <p className="text-red-500 text-sm">{errors.fileCV.message}</p>}

          {files && files.length > 0 && (
            <div className="mt-2">
              {Array.from(files).map((file, index) => (
                <div key={index} className="flex justify-between border p-2">
                  <span>{file.name}</span>
                  <button type="button" onClick={() => setValue("fileCV", null)}>
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <label className="block mb-[10px]" htmlFor="userName">
          {" "}
          <input
            id="userName"
            type="text"
            placeholder="Họ và tên"
            className="w-full h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            {...register("userName", { required: "Vui lòng nhập họ tên!" })}
          />{" "}
          {errors.userName && <p className="text-red-500 text-[13px] mt-[4px]">{errors.userName.message as string}</p>}{" "}
        </label>{" "}
        <label className="block mb-[10px]" htmlFor="email">
          {" "}
          <input
            id="email"
            type="email"
            placeholder="Email"
            className="w-full h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            {...register("email", { required: "Vui lòng nhập email!", pattern: { value: /^\S+@\S+$/i, message: "Email không đúng định dạng!" } })}
          />{" "}
          {errors.email && <p className="text-red-500 text-[13px] mt-[4px]">{errors.email.message as string}</p>}{" "}
        </label>{" "}
        <label className="block mb-[10px]" htmlFor="phone">
          {" "}
          <input
            id="phone"
            type="text"
            placeholder="Số điện thoại"
            className="w-full h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            {...register("phone", { required: "Vui lòng nhập số điện thoại!", pattern: { value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/, message: "Số điện thoại không đúng định dạng!" } })}
          />{" "}
          {errors.phone && <p className="text-red-500 text-[13px] mt-[4px]">{errors.phone.message as string}</p>}{" "}
        </label>{" "}
        <div className="mb-[15px] flex items-center gap-[8px]">
          {" "}
          <input id="agree" type="checkbox" className="w-[16px] h-[16px]" {...register("agree", { required: "Vui lòng đồng ý điều khoản sử dụng trước khi nộp hồ sơ!" })} />{" "}
          <label htmlFor="agree" className="font-[400] text-[14px] text-[#121212]">
            {" "}
            Tôi đồng ý với{" "}
            <button type="button" onClick={() => setShowApplyTerms((prev) => !prev)} className="ml-[4px] text-primary underline underline-offset-2">
              {" "}
              Điều khoản sử dụng{" "}
            </button>{" "}
            <span> </span>của hệ thống.{" "}
          </label>{" "}
        </div>{" "}
        {errors.agree && <p className="text-red-500 text-[13px] mt-[-8px] mb-[8px]">{errors.agree.message as string}</p>}{" "}
        {showApplyTerms && (
          <div className=" flex items-center justify-center">
            {" "}
            <div className="bg-white rounded-[8px] mb-[10px] max-w-[600px] max-h-[80vh] overflow-y-auto">
              {" "}
              <h2 className="font-[700] text-[18px] text-[#121212] mb-[12px]">Điều khoản sử dụng</h2>{" "}
              <p className="font-[400] text-[14px] text-[#121212] whitespace-pre-line">{applyTermsContent}</p>{" "}
            </div>{" "}
          </div>
        )}{" "}
        <button type="submit" className="w-[100%] h-[48px] rounded-[4px] bg-primary font-[700] text-[16px] text-white">
          {" "}
          Nộp hồ sơ ứng tuyển{" "}
        </button>{" "}
      </form>{" "}
    </>
  );
};
