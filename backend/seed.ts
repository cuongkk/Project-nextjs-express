import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "./configs/database.config";
import AccountUser from "./models/account-user.model";
import AccountCompany from "./models/account-company.model";
import Job from "./models/job.model";
import CV from "./models/cv.model";
import Application from "./models/application.model";
import SavedJob from "./models/saved-job.model";
import Notification from "./models/notification.model";
import City from "./models/city.model";

const run = async () => {
  try {
    await connectDB();

    // Xóa dữ liệu cũ của các collection liên quan (tùy bạn, có thể bỏ nếu không muốn)
    await Promise.all([
      AccountUser.deleteMany({}),
      AccountCompany.deleteMany({}),
      Job.deleteMany({}),
      CV.deleteMany({}),
      Application.deleteMany({}),
      SavedJob.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    // Hash mật khẩu mẫu dùng chung
    const hashedPassword = await bcrypt.hash("Cc123456@", 10);

    let hanoiCity = await City.findOne({ name: "Hà Nội" });
    if (!hanoiCity) {
      hanoiCity = await City.create({ name: "Hà Nội" });
    }

    // 1. Tạo user (bao gồm luôn thông tin profile trong AccountUser)
    const user = await AccountUser.create({
      fullName: "Nguyen Van A",
      email: "user1@example.com",
      password: hashedPassword,
      avatar: "https://placehold.co/100x100",
    });

    // 2. Tạo company (lưu city theo _id của City)
    const company = await AccountCompany.create({
      companyName: "Công ty TNHH ABC",
      email: "hr@abc.com",
      password: hashedPassword,
      city: hanoiCity._id.toString(),
      address: "Số 1 Trần Duy Hưng",
      companyModel: "Product",
      companyEmployees: "50-100",
      workingTime: "8:30 - 17:30",
      workOvertime: "Thỉnh thoảng",
      phone: "02466668888",
      description: "Công ty chuyên phát triển sản phẩm phần mềm.",
      logo: "https://placehold.co/120x120",
    });

    // 3. Tạo job
    const job = await Job.create({
      companyId: company._id.toString(),
      title: "Frontend Developer (React)",
      salaryMin: 15000000,
      salaryMax: 25000000,
      position: "Middle",
      workingForm: "Full-time",
      technologies: ["JavaScript", "TypeScript", "React", "Next.js"],
      description: "Phát triển giao diện web sử dụng React/Next.js.",
      images: [],
    });

    // 4. Tạo CV
    const cv = await CV.create({
      jobId: job._id.toString(),
      fullName: user.fullName,
      email: user.email,
      fileCV: "https://example.com/cv/user1.pdf",
    });

    // 5. Tạo Application
    const application = await Application.create({
      userId: user._id.toString(),
      companyId: company._id.toString(),
      jobId: job._id.toString(),
      cvId: cv._id.toString(),
      coverLetter: "Em rất quan tâm tới vị trí Frontend tại công ty.",
      status: "pending",
      notes: "",
      viewedByCompany: false,
    });

    // 6. Tạo SavedJob
    await SavedJob.create({
      userId: user._id.toString(),
      jobId: job._id.toString(),
      companyId: company._id.toString(),
    });

    // 7. Tạo Notification
    await Notification.create({
      userId: user._id.toString(),
      type: "application-status",
      title: "Cập nhật hồ sơ ứng tuyển",
      message: "Hồ sơ của bạn cho vị trí Frontend Developer đã được tạo với trạng thái 'pending'.",
      data: {
        applicationId: application._id.toString(),
        jobId: job._id.toString(),
        status: application.status,
      },
      read: false,
    });

    console.log("Seed dữ liệu mẫu thành công!");
  } catch (error) {
    console.error("Seed dữ liệu thất bại", error);
  } finally {
    await mongoose.disconnect();
  }
};

run();
