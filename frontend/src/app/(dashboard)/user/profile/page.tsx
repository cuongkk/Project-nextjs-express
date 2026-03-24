import { FormProfile } from "./FormProfile";

export default function Page() {
  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
            <h1 className="font-[700] text-[20px] text-black mb-[20px]">Thông tin cá nhân</h1>
            <FormProfile />
          </div>
        </div>
      </div>
    </>
  );
}
