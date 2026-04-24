"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_config_1 = require("./src/configs/database.config");
const user_model_1 = __importDefault(require("./src/modules/user/user.model"));
const company_model_1 = __importDefault(require("./src/modules/company/company.model"));
const job_model_1 = __importDefault(require("./src/modules/job/job.model"));
const cv_model_1 = __importDefault(require("./src/modules/cv/cv.model"));
const application_model_1 = __importDefault(require("./src/modules/application/application.model"));
const saved_job_model_1 = __importDefault(require("./src/modules/user/saved-job.model"));
const notification_model_1 = __importDefault(require("./src/modules/notificaion/notification.model"));
const city_model_1 = __importDefault(require("./src/modules/city/city.model"));
const candidate_profile_model_1 = __importDefault(require("./src/modules/profile/candidate-profile.model"));
const conversation_model_1 = __importDefault(require("./src/modules/chat/conversation.model"));
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickMany = (arr, min = 1, max = arr.length) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    return shuffled.slice(0, count);
};
const fullNames = [
    "Nguyễn Văn An",
    "Trần Thị Bình",
    "Lê Minh Hoàng",
    "Phạm Quang Huy",
    "Đỗ Thị Lan",
    "Nguyễn Đức Trung",
    "Hoàng Văn Nam",
    "Phan Thị Hạnh",
    "Bùi Quốc Khánh",
    "Trịnh Minh Tuấn",
    "Lê Thị Phương",
    "Nguyễn Văn Long",
    "Trần Thị Mai",
    "Phạm Văn Sơn",
    "Đỗ Thị Hương",
    "Nguyễn Đức Anh",
    "Hoàng Thị Thu",
    "Phan Văn Dũng",
    "Bùi Thị Hạnh",
    "Trịnh Minh Quang",
];
const companiesSeed = [
    { name: "Công ty TNHH Công nghệ Sao Việt", companyLogo: "https://res.cloudinary.com/dkamd3ghb/image/upload/v1774839179/OIP_ov3wmi.webp" },
    {
        name: "Công ty Cổ phần Giải pháp Phần mềm Đông Á",
        companyLogo: "https://res.cloudinary.com/dkamd3ghb/image/upload/v1774839788/z5119421643045_b90c711849b6d12837927b42400da4cc-removebg-preview-e1706590731746_azrawj.png",
    },
    { name: "Công ty TNHH TechNova Việt Nam", companyLogo: "https://res.cloudinary.com/dkamd3ghb/image/upload/v1774839564/rnzpeajw2udphwqy96jj_mnmzuv.png" },
    { name: "Công ty Cổ phần Hệ thống Thông tin NextGen", companyLogo: "https://res.cloudinary.com/dkamd3ghb/image/upload/v1774839641/66bfe0dd39b30_nhuds3.png" },
    {
        name: "Công ty Cổ phần Công nghệ Mới FutureTech",
        companyLogo: "https://res.cloudinary.com/dkamd3ghb/image/upload/v1774841454/copy_of_294651402_479488110845252_60951256675266621_n_eb5ab3_8eaaf0.png",
    },
    { name: "Công ty TNHH Phát triển Phần mềm GreenTech", companyLogo: "https://res.cloudinary.com/dkamd3ghb/image/upload/v1774839991/logo_greentech_1-1024x171_azll7h.png" },
    {
        name: "Công ty Cổ phần Công nghệ Sáng tạo BrightFuture",
        companyLogo: "https://res.cloudinary.com/dkamd3ghb/image/upload/v1774840095/302524430_504332608363440_2201710775798932675_n_es8sbk.png",
    },
    {
        name: "FPT Software",
        companyLogo: "https://res.cloudinary.com/dkamd3ghb/image/upload/v1774840856/FPT_Software_Doc_ideyhi.jpg",
    },
    {
        name: "Viettel Solutions",
        companyLogo: "https://res.cloudinary.com/dkamd3ghb/image/upload/v1774840273/logo3_gzremi.png",
    },
    {
        name: "Công ty Cổ phần Công nghệ Phần mềm VNG",
        companyLogo: "https://res.cloudinary.com/dkamd3ghb/image/upload/v1774840432/vng-orange-compact_asyr8z.png",
    },
    {
        name: "TMA Tech Group",
        companyLogo: "https://res.cloudinary.com/dkamd3ghb/image/upload/v1774841958/logo-menu_x9g7mv.webp",
    },
    {
        name: "Công ty TNHH Salaman Việt Nam",
        companyLogo: "https://res.cloudinary.com/dkamd3ghb/image/upload/v1774841872/logo_sxfvl6.png",
    },
];
const tech = ["JavaScript", "TypeScript", "Python", "Java", "C#", "PHP", "C++", "SQL", "NoSQL"];
const jobTitles = [
    "Frontend Developer ",
    "Backend Developer ",
    "Fullstack Developer",
    "Mobile Developer ",
    "DevOps Engineer",
    "Data Scientist",
    "UI/UX Designer",
    "Project Manager",
    "Business Analyst",
    "Technical Support Engineer",
    "AI Engineer",
    "Game Developer",
    "Network Engineer",
];
const companyDescription = `
Chúng tôi là một công ty công nghệ chuyên phát triển các giải pháp phần mềm hiện đại
cho doanh nghiệp trong và ngoài nước. Với đội ngũ kỹ sư giàu kinh nghiệm, chúng tôi
luôn hướng đến việc xây dựng các sản phẩm chất lượng cao, tối ưu hiệu suất và mang
lại giá trị thực tiễn cho khách hàng. Môi trường làm việc năng động, sáng tạo và
khuyến khích sự phát triển cá nhân là điểm mạnh của chúng tôi.
Chúng tôi cam kết tạo ra một môi trường làm việc tích cực, nơi mọi người có thể
phát huy tối đa khả năng của mình và cùng nhau đạt được những thành công lớn trong
lĩnh vực công nghệ.

`;
const jobDescription = `
Bạn sẽ tham gia vào quá trình phát triển sản phẩm từ giai đoạn phân tích yêu cầu,
thiết kế hệ thống đến triển khai và tối ưu. Làm việc cùng team Agile, sử dụng các
công nghệ hiện đại và có cơ hội học hỏi, phát triển kỹ năng chuyên môn cũng như kỹ
năng làm việc nhóm. Công việc yêu cầu tinh thần trách nhiệm cao và khả năng tự học tốt.
Chúng tôi tìm kiếm những ứng viên đam mê công nghệ, có tư duy logic và khả năng giải
quyết vấn đề, sẵn sàng đối mặt với thử thách và không ngừng học hỏi để cùng phát triển
cùng công ty. Nếu bạn muốn làm việc trong một môi trường năng động, sáng tạo và có cơ
hội phát triển bản thân, hãy gia nhập đội ngũ của chúng tôi!
`;
const jobRequirements = `
- Có kiến thức nền tảng tốt về lập trình và cấu trúc dữ liệu.
- Có kinh nghiệm làm việc với Git, API REST và cơ sở dữ liệu.
- Có khả năng đọc hiểu tài liệu kỹ thuật tiếng Anh.
- Chủ động, trách nhiệm và có tinh thần học hỏi liên tục.
`;
const jobBenefits = `
- Lương thưởng cạnh tranh theo năng lực.
- Review lương định kỳ và thưởng hiệu quả công việc.
- Môi trường làm việc linh hoạt, hỗ trợ hybrid/remote.
- Bảo hiểm đầy đủ và các hoạt động nội bộ định kỳ.
`;
const profileEducation = [
    "Đại học Bách Khoa Hà Nội - Công nghệ thông tin",
    "Đại học Công nghệ - Đại học Quốc gia Hà Nội",
    "Đại học FPT - Kỹ thuật phần mềm",
    "Đại học Khoa học Tự nhiên - Khoa học máy tính",
    "Đại học CNTT TP.HCM - Hệ thống thông tin",
];
const locations = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng"];
const applicationStatuses = ["applied", "screening", "interview", "offer", "hired", "rejected"];
const buildApplicationHistory = (finalStatus) => {
    const now = Date.now();
    if (finalStatus === "rejected") {
        const rejectedAt = random(["applied", "screening", "interview", "offer"]);
        const track = ["applied"];
        if (["screening", "interview", "offer"].includes(rejectedAt))
            track.push("screening");
        if (["interview", "offer"].includes(rejectedAt))
            track.push("interview");
        if (["offer"].includes(rejectedAt))
            track.push("offer");
        track.push("rejected");
        return track.map((status, index) => ({
            status,
            updatedAt: new Date(now - (track.length - index) * 24 * 60 * 60 * 1000),
            note: status === "rejected" ? "Không phù hợp yêu cầu hiện tại" : "",
        }));
    }
    const flow = ["applied", "screening", "interview", "offer"];
    const endIndex = flow.indexOf(finalStatus);
    const steps = flow.slice(0, endIndex + 1);
    return steps.map((status, index) => ({
        status,
        updatedAt: new Date(now - (steps.length - index) * 24 * 60 * 60 * 1000),
        note: "",
    }));
};
const run = async () => {
    try {
        await (0, database_config_1.connectDB)();
        await Promise.all([
            user_model_1.default.deleteMany({}),
            company_model_1.default.deleteMany({}),
            job_model_1.default.deleteMany({}),
            cv_model_1.default.deleteMany({}),
            application_model_1.default.deleteMany({}),
            saved_job_model_1.default.deleteMany({}),
            notification_model_1.default.deleteMany({}),
            city_model_1.default.deleteMany({}),
            candidate_profile_model_1.default.deleteMany({}),
            conversation_model_1.default.deleteMany({}),
        ]);
        const hashedPassword = await bcryptjs_1.default.hash("Cc123456@", 10);
        // ===== City =====
        const cities = await Promise.all(["Hà Nội", "Hồ Chí Minh", "Đà Nẵng"].map((c) => city_model_1.default.create({ name: c })));
        // ===== Users =====
        const users = await Promise.all(Array.from({ length: 20 }).map((_, i) => {
            const fullName = random(fullNames);
            const name = fullName.trim().split(" ").slice(-1)[0];
            return user_model_1.default.create({
                name,
                fullName,
                email: `user${i}@gmail.com`,
                password: hashedPassword,
                role: "candidate",
                avatar: "https://placehold.co/100x100",
            });
        }));
        await Promise.all(users.map((user) => candidate_profile_model_1.default.create({
            userId: user._id.toString(),
            skills: pickMany(tech, 3, 6),
            experienceYears: Math.floor(Math.random() * 6),
            education: random(profileEducation),
            resumeUrl: "https://example.com/cv.pdf",
            bio: "Ứng viên có tinh thần học hỏi, trách nhiệm và khả năng làm việc nhóm tốt.",
            expectedSalaryMin: Math.floor(Math.random() * 8) + 8,
            expectedSalaryMax: Math.floor(Math.random() * 8) + 16,
            location: random(locations),
            isPublic: Math.random() > 0.15,
        })));
        // ===== Companies + Jobs =====
        const allJobs = [];
        let count = 1;
        for (const { name, companyLogo } of companiesSeed) {
            const company = await company_model_1.default.create({
                companyName: name,
                email: `company${count}@hr.com`,
                password: hashedPassword,
                city: random(cities)._id.toString(),
                role: "employer",
                address: "Hà Nội",
                companyEmployees: random(["10-50", "50-100", "100-200"]),
                workingTime: "8:30 - 17:30",
                phone: "0123456789",
                description: companyDescription,
                logo: companyLogo,
            });
            count++;
            // mỗi company: 1–3 job
            const jobCount = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < jobCount; i++) {
                const salaryMin = Math.floor(Math.random() * 10) + 6;
                const jobTechs = pickMany(tech, 2, 5);
                const level = random(["intern", "fresher", "junior", "middle", "senior", "manager"]);
                const type = random(["remote", "onsite", "hybrid"]);
                const expiresInDays = Math.floor(Math.random() * 45) + 15;
                const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
                const job = await job_model_1.default.create({
                    companyId: company._id.toString(),
                    createdBy: company._id.toString(),
                    title: random(jobTitles),
                    companyName: company.companyName,
                    location: random(locations),
                    type,
                    level,
                    salaryMin: salaryMin,
                    salaryMax: salaryMin + 5,
                    position: level,
                    workingForm: type,
                    techStack: jobTechs,
                    technologies: jobTechs,
                    requirements: jobRequirements,
                    benefits: jobBenefits,
                    city: random(cities)._id.toString(),
                    description: jobDescription,
                    images: [],
                    status: "active",
                    expiresAt,
                });
                allJobs.push(job);
                // mỗi job ~5 ứng viên
                const appliedUsers = new Set();
                for (let j = 0; j < 5; j++) {
                    let user;
                    do {
                        user = random(users);
                    } while (appliedUsers.has(user._id.toString()));
                    appliedUsers.add(user._id.toString());
                    const cv = await cv_model_1.default.create({
                        userId: user._id.toString(),
                        jobId: job._id.toString(),
                        email: user.email,
                        userName: user.fullName,
                        phone: "0123456789",
                        fileCV: "https://example.com/cv.pdf",
                    });
                    const application = await application_model_1.default.create({
                        userId: user._id.toString(),
                        candidateId: user._id.toString(),
                        companyId: company._id.toString(),
                        jobId: job._id.toString(),
                        cvId: cv._id.toString(),
                        resumeUrl: cv.fileCV,
                        status: random(applicationStatuses),
                        viewedByCompany: true,
                        interviewDate: Math.random() > 0.6 ? new Date(Date.now() + Math.floor(Math.random() * 14 + 1) * 24 * 60 * 60 * 1000) : undefined,
                        note: "Ứng tuyển từ nguồn seed",
                    });
                    const history = buildApplicationHistory(application.status);
                    application.set("history", history);
                    application.viewedByCompany = application.status !== "applied";
                    await application.save();
                    await notification_model_1.default.create({
                        receiverId: user._id.toString(),
                        receiverType: "user",
                        title: "Cập nhật ứng tuyển",
                        message: `Bạn đã ứng tuyển vào ${job.title}`,
                        data: {
                            jobId: job._id.toString(),
                            status: application.status,
                        },
                        read: false,
                    });
                    await notification_model_1.default.create({
                        receiverId: company._id.toString(),
                        receiverType: "company",
                        title: "Đơn ứng tuyển mới",
                        message: `Có ứng viên mới ứng tuyển vào vị trí ${job.title}`,
                        data: {
                            applicationId: application._id.toString(),
                            jobId: job._id.toString(),
                            candidateId: user._id.toString(),
                        },
                        read: Math.random() > 0.7,
                    });
                }
            }
        }
        // ===== Saved Jobs =====
        for (const user of users) {
            const favoriteJobs = pickMany(allJobs, 1, Math.min(5, allJobs.length));
            for (const job of favoriteJobs) {
                await saved_job_model_1.default.create({
                    userId: user._id.toString(),
                    jobId: job._id.toString(),
                    companyId: job.companyId,
                });
            }
        }
        console.log("🔥 Seed dữ liệu hoàn tất (users, profiles, companies, jobs, cvs, applications, notifications, saved-jobs)");
    }
    catch (error) {
        console.error("❌ Seed lỗi", error);
    }
    finally {
        await mongoose_1.default.disconnect();
    }
};
run();
