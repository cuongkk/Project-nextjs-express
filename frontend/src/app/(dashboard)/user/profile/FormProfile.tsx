"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { set, useForm } from "react-hook-form";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { Toaster } from "sonner";
import { setReloadToast, showReloadToastIfAny } from "@/utils/toast.helper";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

export const FormProfile = () => {
  const { infoUser, isLogin, isAuthLoaded } = useAuth();
  const router = useRouter();
  const [avatars, setAvatars] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    showReloadToastIfAny();
  }, []);

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!isLogin) {
      router.replace("/user/login");
    }
  }, [isAuthLoaded, isLogin, router]);

  useEffect(() => {
    if (!infoUser) return;

    setValue("fullName", infoUser.fullName);
    setValue("email", infoUser.email);
    setValue("phone", infoUser.phone);
    setValue("birthday", infoUser.birthday ? new Date(infoUser.birthday).toISOString().split("T")[0] : "");
    setValue("gender", infoUser.gender || "");
    setValue("address", infoUser.address || "");
    setValue("experienceYears", infoUser.experienceYears || "");
    setValue("currentPosition", infoUser.currentPosition || "");
    setValue("desiredPosition", infoUser.desiredPosition || "");
    setValue("skills", infoUser.skills ? infoUser.skills.join(", ") : "");
    setValue("education", infoUser.education ? infoUser.education.join(", ") : "");
    setValue("socials", infoUser.socials ? JSON.stringify(infoUser.socials) : "");

    if (infoUser.avatar) {
      setAvatars([{ source: infoUser.avatar }]);
    }
  }, [infoUser, setValue]);

  // submit
  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);

    if (avatars[0]?.file) {
      formData.append("avatar", avatars[0].file);
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
      method: "PATCH",
      body: formData,
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "error") {
          setReloadToast("error", data.message || "Cập nhật thất bại");
          window.location.reload();
        }

        if (data.code === "success") {
          setReloadToast("success", data.message || "Cập nhật thành công");
          window.location.reload();
        }
      });
  };

  return (
    <>
      <Toaster richColors position="top-right" />

      {infoUser && (
        <form onSubmit={handleSubmit(onSubmit) as any} className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]">
          {/* Avatar */}
          <div className="sm:col-span-2">
            <label className="block mb-[5px]">Avatar</label>
            <div className="w-[120px] h-[120px] overflow-hidden">
              <FilePond className="h-full" files={avatars} onupdatefiles={setAvatars} acceptedFileTypes={["image/*"]} />
            </div>
          </div>

          {/* Full name */}
          <div>
            <label className="block mb-[5px]">Họ tên *</label>
            <input
              {...register("fullName", {
                required: "Vui lòng nhập họ tên!",
                minLength: { value: 5, message: "Ít nhất 5 ký tự!" },
                maxLength: { value: 50, message: "Tối đa 50 ký tự!" },
              })}
              className="w-full h-[46px] border px-[20px]"
            />
            {errors.fullName && <p className="text-red-500">{errors.fullName.message as string}</p>}
          </div>

          {/* Email */}
          <div>
            <label>Email *</label>
            <input
              {...register("email", {
                required: "Vui lòng nhập email!",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Email không hợp lệ!",
                },
              })}
              className="w-full h-[46px] border px-[20px]"
            />
            {errors.email && <p className="text-red-500">{errors.email.message as string}</p>}
          </div>

          <div className="sm:col-span-2 flex gap-x-[10px]">
            <button className="bg-blue-500 text-white h-[48px] w-full">Cập nhật</button>
          </div>
        </form>
      )}
    </>
  );
};
