import { FormLogin } from "./FormLogin";
export default function Page() {
  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          <div className="border border-[#DEDEDE] rounded-[8px] py-[50px] px-[20px] max-w-[602px] mx-auto">
            <h1 className="font-[700] text-[20px] text-black text-center mb-[20px]">Đăng nhập (Nhà tuyển dụng)</h1>
            <FormLogin />
          </div>
        </div>
      </div>
    </>
  );
}
