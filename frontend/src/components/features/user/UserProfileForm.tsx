"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/useApiData";
import { invalidateCache } from "@/hooks/useApiData";

type ProfileState = {
  name: string;
  skills: string;
  experienceYears: string;
  education: string;
  bio: string;
  expectedSalaryMin: string;
  expectedSalaryMax: string;
  location: string;
  isPublic: boolean;
  resumeUrl: string;
};

export const UserProfileForm = () => {
  const { profile, isLoading, mutate } = useUserProfile();

  const [uploading, setUploading] = useState(false);
  const [state, setState] = useState<ProfileState>({
    name: "",
    skills: "",
    experienceYears: "0",
    education: "",
    bio: "",
    expectedSalaryMin: "0",
    expectedSalaryMax: "0",
    location: "",
    isPublic: true,
    resumeUrl: "",
  });

  // Update state when profile data loads
  useEffect(() => {
    if (profile) {
      const user = profile.user || {};
      const profileData = profile.profile || {};

      setState({
        name: user.name || "",
        skills: Array.isArray(profileData.skills) ? profileData.skills.join(", ") : "",
        experienceYears: `${profileData.experienceYears ?? 0}`,
        education: profileData.education || "",
        bio: profileData.bio || "",
        expectedSalaryMin: `${profileData.expectedSalaryMin ?? 0}`,
        expectedSalaryMax: `${profileData.expectedSalaryMax ?? 0}`,
        location: profileData.location || "",
        isPublic: profileData.isPublic ?? true,
        resumeUrl: profileData.resumeUrl || "",
      });
    }
  }, [profile]);

  const updateField = (key: keyof ProfileState, value: string | boolean) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      name: state.name,
      skills: state.skills,
      experienceYears: Number(state.experienceYears || 0),
      education: state.education,
      bio: state.bio,
      expectedSalaryMin: Number(state.expectedSalaryMin || 0),
      expectedSalaryMax: Number(state.expectedSalaryMax || 0),
      location: state.location,
      isPublic: state.isPublic,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/me`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.code === "success") {
        toast.success(data.message || "Cập nhật hồ sơ thành công");
        invalidateCache("profile");
        mutate();
      } else {
        toast.error(data.message || "Cập nhật hồ sơ thất bại");
      }
    } catch {
      toast.error("Cập nhật hồ sơ thất bại");
    }
  };

  const onUploadResume = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    setUploading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/me/cv`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();

      if (data.code === "success") {
        setState((prev) => ({ ...prev, resumeUrl: data.profile?.resumeUrl || prev.resumeUrl }));
        toast.success(data.message || "Tải CV thành công");
        invalidateCache("profile");
        mutate();
      } else {
        toast.error(data.message || "Tải CV thất bại");
      }
    } catch {
      toast.error("Tải CV thất bại");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return <p>Đang tải hồ sơ...</p>;
  }

  return (
    <form onSubmit={onSubmit} className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]">
      <div>
        <label className="block mb-[5px]">Họ tên</label>
        <input value={state.name} onChange={(e) => updateField("name", e.target.value)} className="w-full h-[46px] border px-[20px]" />
      </div>

      <div>
        <label className="block mb-[5px]">Kinh nghiệm (năm)</label>
        <input type="number" value={state.experienceYears} onChange={(e) => updateField("experienceYears", e.target.value)} className="w-full h-[46px] border px-[20px]" />
      </div>

      <div className="sm:col-span-2">
        <label className="block mb-[5px]">Kỹ năng (cách nhau bởi dấu phẩy)</label>
        <input value={state.skills} onChange={(e) => updateField("skills", e.target.value)} className="w-full h-[46px] border px-[20px]" />
      </div>

      <div>
        <label className="block mb-[5px]">Mức lương mong muốn tối thiểu</label>
        <input type="number" value={state.expectedSalaryMin} onChange={(e) => updateField("expectedSalaryMin", e.target.value)} className="w-full h-[46px] border px-[20px]" />
      </div>

      <div>
        <label className="block mb-[5px]">Mức lương mong muốn tối đa</label>
        <input type="number" value={state.expectedSalaryMax} onChange={(e) => updateField("expectedSalaryMax", e.target.value)} className="w-full h-[46px] border px-[20px]" />
      </div>

      <div className="sm:col-span-2">
        <label className="block mb-[5px]">Học vấn</label>
        <input value={state.education} onChange={(e) => updateField("education", e.target.value)} className="w-full h-[46px] border px-[20px]" />
      </div>

      <div className="sm:col-span-2">
        <label className="block mb-[5px]">Địa điểm</label>
        <input value={state.location} onChange={(e) => updateField("location", e.target.value)} className="w-full h-[46px] border px-[20px]" />
      </div>

      <div className="sm:col-span-2">
        <label className="block mb-[5px]">Giới thiệu</label>
        <textarea value={state.bio} onChange={(e) => updateField("bio", e.target.value)} className="w-full min-h-[120px] border px-[20px] py-[10px]" />
      </div>

      <div className="sm:col-span-2 flex items-center gap-2">
        <input id="isPublic" type="checkbox" checked={state.isPublic} onChange={(e) => updateField("isPublic", e.target.checked)} />
        <label htmlFor="isPublic">Cho phép nhà tuyển dụng xem profile công khai</label>
      </div>

      <div className="sm:col-span-2">
        <label className="block mb-[5px]">CV hiện tại</label>
        {state.resumeUrl ? (
          <a href={state.resumeUrl} target="_blank" rel="noreferrer" className="text-primary underline break-all">
            {state.resumeUrl}
          </a>
        ) : (
          <p className="text-[#6B7280]">Chưa có CV</p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label className="block mb-[5px]">Tải CV mới</label>
        <input type="file" accept=".pdf,.doc,.docx" onChange={onUploadResume} />
        {uploading && <p className="text-sm text-[#6B7280] mt-1">Đang tải lên...</p>}
      </div>

      <div className="sm:col-span-2 flex gap-x-[10px]">
        <button className="bg-blue-500 text-white h-[48px] w-full">Cập nhật hồ sơ</button>
      </div>
    </form>
  );
};
