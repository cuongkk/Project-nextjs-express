/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/refs */
"use client";
import { EditorMCE } from "@/components/ui/EditorMCE";
import { useRef, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { Toaster, toast } from "sonner";
import { positionList, workingFormList } from "@/configs/variable";
import { useForm } from "react-hook-form";
import { TechCheckboxGroup } from "@/components/ui/CheckBoxList";
import { TechList } from "@/configs/variable";
// Register the plugin
registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

export const JobCreateForm = () => {
  const editorRef = useRef(null);
  const [images, setImages] = useState<any[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    let description = "";
    if (editorRef.current) {
      description = (editorRef.current as any).getContent();
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("salaryMin", data.salaryMin);
    formData.append("salaryMax", data.salaryMax);
    formData.append("position", data.position);
    formData.append("workingForm", data.workingForm);
    data.technologies.forEach((tech: string) => {
      formData.append("technologies[]", tech);
    });
    formData.append("description", description);

    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        if (images[i]?.file) {
          formData.append("images", images[i].file);
        }
      }
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
      method: "POST",
      body: formData,
      credentials: "include", // Gửi kèm cookie
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === "error") {
          toast.error(result.message);
        }
        if (result.code === "success") {
          toast.success(result.message);
          reset();
          setImages([]);
          if (editorRef.current) {
            (editorRef.current as any).setContent("");
          }
        }
      });
  };

  return (
    <>
      <Toaster richColors position="top-right" toastOptions={{ duration: 1000 }} />
      <form className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]" id="createForm" onSubmit={handleSubmit(onSubmit) as any}>
        <div className="sm:col-span-2">
          <label htmlFor="title" className="block font-[500] text-[14px] text-black mb-[5px]">
            Tên công việc *
          </label>
          <input
            id="title"
            type="text"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            {...register("title", {
              required: "Vui lòng nhập tên công việc!",
            })}
          />
          {errors.title && <p className="text-red-500 text-[13px] mt-[4px]">{errors.title.message as string}</p>}
        </div>
        <div className="">
          <label htmlFor="salaryMin" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mức lương tối thiểu
          </label>
          <input id="salaryMin" type="number" className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black" {...register("salaryMin")} />
        </div>
        <div className="">
          <label htmlFor="salaryMax" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mức lương tối đa
          </label>
          <input id="salaryMax" type="number" className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black" {...register("salaryMax")} />
        </div>
        <div className="">
          <label htmlFor="position" className="block font-[500] text-[14px] text-black mb-[5px]">
            Cấp bậc *
          </label>
          <select
            id="position"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            {...register("position", { required: "Vui lòng chọn cấp bậc!" })}
          >
            {positionList.map((item: any, index: number) => (
              <option value={item.value} key={index}>
                {item.label}
              </option>
            ))}
          </select>
          {errors.position && <p className="text-red-500 text-[13px] mt-[4px]">{errors.position.message as string}</p>}
        </div>
        <div className="">
          <label htmlFor="workingForm" className="block font-[500] text-[14px] text-black mb-[5px]">
            Hình thức làm việc *
          </label>
          <select
            id="workingForm"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            {...register("workingForm", { required: "Vui lòng chọn hình thức làm việc!" })}
          >
            {workingFormList.map((item: any, index: number) => (
              <option value={item.value} key={index}>
                {item.label}
              </option>
            ))}
          </select>
          {errors.workingForm && <p className="text-red-500 text-[13px] mt-[4px]">{errors.workingForm.message as string}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="technologies" className="block font-[500] text-[14px] text-black mb-[5px]">
            Các công nghệ
          </label>
          <TechCheckboxGroup register={register} id="technologies" List={TechList} value={[]} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="images" className="block font-[500] text-[14px] text-black mb-[5px]">
            Danh sách ảnh
          </label>
          <FilePond name="images" labelIdle="+" acceptedFileTypes={["image/*"]} files={images} onupdatefiles={setImages} allowMultiple={true} maxFiles={8} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mô tả chi tiết
          </label>
          <EditorMCE editorRef={editorRef} value={""} id="description" />
        </div>
        <div className="sm:col-span-2">
          <button className="bg-[#0088FF] rounded-[4px] h-[48px] px-[20px] font-[700] text-[16px] text-white">Tạo mới</button>
        </div>
      </form>
    </>
  );
};
