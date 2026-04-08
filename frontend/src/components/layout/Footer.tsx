export const Footer = () => {
  return (
    <footer className="bg-[#000065] pt-[32px] pb-[20px] mt-[40px] text-white">
      <div className="contain">
        <div className="grid md:grid-cols-4 grid-cols-1 gap-[24px] mb-[24px]">
          <div>
            <div className="font-[800] text-[24px] mb-[8px]">ITJobs</div>
            <p className="text-[14px] text-[#D1D5DB]">Nền tảng kết nối lập trình viên và nhà tuyển dụng IT hàng đầu tại Việt Nam.</p>
          </div>
          <div>
            <h4 className="font-[700] text-[14px] mb-[10px]">Việc làm</h4>
            <ul className="space-y-[6px] text-[14px] text-[#D1D5DB]">
              <li>Việc làm theo kỹ năng</li>
              <li>Việc làm theo thành phố</li>
              <li>Công ty nổi bật</li>
            </ul>
          </div>
          <div>
            <h4 className="font-[700] text-[14px] mb-[10px]">Ứng viên</h4>
            <ul className="space-y-[6px] text-[14px] text-[#D1D5DB]">
              <li>Quản lý CV</li>
              <li>Đơn ứng tuyển</li>
            </ul>
          </div>
          <div>
            <h4 className="font-[700] text-[14px] mb-[10px]">Liên hệ</h4>
            <ul className="space-y-[6px] text-[14px] text-[#D1D5DB]">
              <li>Email: support@itjobs.vn</li>
              <li>Hotline: 0123 456 789</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#1F2937] pt-[12px] text-center text-[13px] text-[#9CA3AF]">Copyright © {new Date().getFullYear()} ITJobs. All rights reserved.</div>
      </div>
    </footer>
  );
};
