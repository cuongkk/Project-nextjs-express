/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/refs */
"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { EditorMCE } from "@/components/ui/EditorMCE";
import { setReloadToast } from "@/utils/toast.helper";

// Register the plugin
registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

export const CompanyProfileForm = () => {
  const { infoCompany, isLogin, isAuthLoaded } = useAuth();
  const router = useRouter();
  const [logos, setLogos] = useState<any[]>([]);
  const [cityList, setCityList] = useState<any[]>([]);
  const editorRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/cities`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          setCityList(data.cityList);
        }
      });
  }, []);

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!isLogin) {
      router.replace("/auth/login");
    }
  }, [isAuthLoaded, isLogin, router]);

  useEffect(() => {
    if (!infoCompany) return;

    if (infoCompany.logo) {
      setLogos([
        {
          source: infoCompany.logo,
        },
      ]);
    }
    // Set giá trị mặc định cho form
    setValue("companyName", infoCompany.companyName || "");
    setValue("city", infoCompany.city || "");
    setValue("address", infoCompany.address || "");
    setValue("companyModel", infoCompany.companyModel || "");
    setValue("companyEmployees", infoCompany.companyEmployees || "");
    setValue("workingTime", infoCompany.workingTime || "");
    setValue("workOvertime", infoCompany.workOvertime || "");
    setValue("email", infoCompany.email || "");
    setValue("phone", infoCompany.phone || "");
    setValue("description", infoCompany.description || "");
  }, [infoCompany, setValue]);

  const onSubmit = (data: any) => {
    const formData = new FormData();

    formData.append("companyName", data.companyName);

    if (logos[0]?.file) {
      formData.append("logo", logos[0].file);
    }

    if (data.city) formData.append("city", data.city);
    if (data.address) formData.append("address", data.address);
    if (data.companyModel) formData.append("companyModel", data.companyModel);
    if (data.companyEmployees) formData.append("companyEmployees", data.companyEmployees);
    if (data.workingTime) formData.append("workingTime", data.workingTime);
    if (data.workOvertime) formData.append("workOvertime", data.workOvertime);
    formData.append("email", data.email);
    if (data.phone) formData.append("phone", data.phone);
    let description = "";
    if (editorRef.current) {
      description = (editorRef.current as any).getContent();
    }
    formData.append("description", description);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/me`, {
      method: "PATCH",
      body: formData,
      credentials: "include", // Gửi kèm cookie
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === "error") {
          setReloadToast("error", result.message || "Cập nhật thất bại");
          window.location.reload();
        }
        if (result.code === "success") {
          setReloadToast("success", result.message || "Cập nhật thành công");
          window.location.reload();
        }
      });
  };

  return (
    <>
      {infoCompany && (
        <form className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]" id="profileForm" onSubmit={handleSubmit(onSubmit) as any}>
          <div className="sm:col-span-2">
            <label htmlFor="companyName" className="block font-[500] text-[14px] text-black mb-[5px]">
              Tên công ty *
            </label>
            <input
              id="companyName"
              type="text"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              {...register("companyName", {
                required: "Vui lòng nhập tên công ty!",
                maxLength: { value: 200, message: "Vui lòng nhập tối đa 200 ký tự!" },
              })}
            />
            {errors.companyName && <p className="text-red-500 text-[13px] mt-[4px]">{errors.companyName.message as string}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="logo" className="block font-[500] text-[14px] text-black mb-[5px]">
              Logo
            </label>
            <FilePond name="logo" labelIdle="+" acceptedFileTypes={["image/*"]} files={logos} onupdatefiles={setLogos} />
          </div>
          <div className="">
            <label htmlFor="city" className="block font-[500] text-[14px] text-black mb-[5px]">
              Thành phố
            </label>
            <select id="city" className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black" {...register("city")}>
              <option value="">Chọn thành phố</option>
              {cityList.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="">
            <label htmlFor="address" className="block font-[500] text-[14px] text-black mb-[5px]">
              Địa chỉ
            </label>
            <input id="address" type="text" className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black" {...register("address")} />
          </div>
          <div className="">
            <label htmlFor="companyModel" className="block font-[500] text-[14px] text-black mb-[5px]">
              Mô hình công ty
            </label>
            <input
              id="companyModel"
              type="text"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              {...register("companyModel")}
            />
          </div>
          <div className="">
            <label htmlFor="companyEmployees" className="block font-[500] text-[14px] text-black mb-[5px]">
              Quy mô công ty
            </label>
            <input
              id="companyEmployees"
              type="text"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              {...register("companyEmployees")}
            />
          </div>
          <div className="">
            <label htmlFor="workingTime" className="block font-[500] text-[14px] text-black mb-[5px]">
              Thời gian làm việc
            </label>
            <input
              id="workingTime"
              type="text"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              {...register("workingTime")}
            />
          </div>
          <div className="">
            <label htmlFor="workOvertime" className="block font-[500] text-[14px] text-black mb-[5px]">
              Làm việc ngoài giờ
            </label>
            <input
              id="workOvertime"
              type="text"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              {...register("workOvertime")}
            />
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
            <label htmlFor="phone" className="block font-[500] text-[14px] text-black mb-[5px]">
              Số điện thoại
            </label>
            <input id="phone" type="text" className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black" {...register("phone")} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block font-[500] text-[14px] text-black mb-[5px]">
              Mô tả chi tiết
            </label>
            <EditorMCE editorRef={editorRef} value={infoCompany.description || ""} id="description" />
          </div>
          <div className="sm:col-span-2">
            <button className="bg-[#0088FF] rounded-[4px] h-[48px] px-[20px] font-[700] text-[16px] text-white">Cập nhật</button>
          </div>
        </form>
      )}
    </>
  );
};
