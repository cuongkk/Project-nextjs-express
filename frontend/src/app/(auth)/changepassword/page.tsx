import type { Metadata } from "next";
import { ChangePassForm } from "./ChangePassForm";

/* eslint-disable @next/next/no-img-element */
export const metadata: Metadata = {
  title: "Đổi mật khẩu",
};

export default function Page() {
  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          <h2 className="font-[700] sm:text-[28px] text-[24px] sm:w-auto w-[100%] text-[#121212] mb-[20px]">Đổi mật khẩu</h2>
          <ChangePassForm />
        </div>
      </div>
    </>
  );
}
