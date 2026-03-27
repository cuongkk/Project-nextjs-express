/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const cookieHeader = [accessToken ? `accessToken=${accessToken}` : "", refreshToken ? `refreshToken=${refreshToken}` : ""].filter(Boolean).join("; ");

  let infoCV: any = null;
  let errorMessage = "";

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${id}`, {
      method: "GET",
      headers: cookieHeader ? { cookie: cookieHeader } : {},
      cache: "no-store",
    });

    const data = await res.json();

    if (data.code === "success" && data.cv) {
      infoCV = {
        fullName: data.cv.userName,
        email: data.cv.email,
        phone: data.cv.phone,
        fileCV: data.cv.fileCV,
      };
    } else {
      errorMessage = data.message || "Lấy thông tin CV thất bại!";
    }
  } catch (error) {
    console.error("Error fetching CV details:", error);
    errorMessage = "Lấy thông tin CV thất bại!";
  }

  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          {/* Thông tin CV */}
          {infoCV ? (
            <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
              <div className="flex flex-wrap gap-[20px] items-center justify-between mb-[20px]">
                <h2 className="sm:w-auto w-[100%] font-[700] text-[20px] text-black">Thông tin CV</h2>
                <Link href="/cv" className="font-[400] text-[14px] text-[#0088FF] underline">
                  Quay lại danh sách
                </Link>
              </div>

              <div className="font-[400] text-[16px] text-black mb-[10px]">
                Họ tên:
                <span className="font-[700] ml-[5px]">{infoCV.fullName}</span>
              </div>
              <div className="font-[400] text-[16px] text-black mb-[10px]">
                Email:
                <span className="font-[700] ml-[5px]">{infoCV.email}</span>
              </div>
              <div className="font-[400] text-[16px] text-black mb-[10px]">
                Số điện thoại:
                <span className="font-[700] ml-[5px]">{infoCV.phone}</span>
              </div>
              <div className="font-[400] text-[16px] text-black mb-[10px]">File CV:</div>
              <div className="bg-[#D9D9D9] h-[736px]">
                {infoCV.fileCV?.includes("/raw/") ? (
                  <iframe src={`https://docs.google.com/gview?url=${infoCV.fileCV}&embedded=true`} width="100%" height="100%" />
                ) : (
                  <img src={infoCV.fileCV} alt="CV" className="w-full h-full object-contain" />
                )}
              </div>
            </div>
          ) : (
            <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
              <div className="flex flex-wrap gap-[20px] items-center justify-between mb-[20px]">
                <h2 className="sm:w-auto w-[100%] font-[700] text-[20px] text-black">Thông tin CV</h2>
                <Link href="/cv" className="font-[400] text-[14px] text-[#0088FF] underline">
                  Quay lại danh sách
                </Link>
              </div>
              <p className="font-[400] text-[16px] text-black">{errorMessage || "Không tìm thấy thông tin CV."}</p>
            </div>
          )}

          {/* Hết Thông tin CV */}
        </div>
      </div>
    </>
  );
}
