import { AccountRequest } from "../../interfaces/request.interface";
import AccountUser from "../user/user.model";
import CandidateProfile from "./candidate-profile.model";

const mapSkills = (skills: unknown): string[] => {
  if (Array.isArray(skills)) {
    return skills.map((item) => `${item}`.trim()).filter(Boolean);
  }

  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const parseNumber = (value: unknown, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

export const me = async (req: AccountRequest) => {
  const userId = req.account.id;

  const user = await AccountUser.findById(userId).select("fullName name email avatar role");
  if (!user) {
    return { code: "error", message: "Không tìm thấy tài khoản!" };
  }

  let profile = await CandidateProfile.findOne({ userId });
  if (!profile) {
    profile = await CandidateProfile.create({ userId });
  }

  return {
    code: "success",
    message: "Lấy thông tin hồ sơ thành công!",
    data: {
      user: {
        id: user.id,
        name: user.fullName || user.name || "",
        email: user.email,
        avatar: user.avatar || "",
        role: user.role || "candidate",
      },
      profile,
    },
  };
};

export const patchMe = async (req: AccountRequest) => {
  const userId = req.account.id;

  const userPatch: any = {};
  if ((req.body as any).name) {
    userPatch.name = (req.body as any).name;
    userPatch.fullName = (req.body as any).name;
  }
  if ((req.body as any).avatar) {
    userPatch.avatar = (req.body as any).avatar;
  }

  if (Object.keys(userPatch).length > 0) {
    await AccountUser.updateOne({ _id: userId }, userPatch);
  }

  const profilePatch: any = {};
  if ((req.body as any).skills !== undefined) profilePatch.skills = mapSkills((req.body as any).skills);
  if ((req.body as any).experienceYears !== undefined) profilePatch.experienceYears = parseNumber((req.body as any).experienceYears, 0);
  if ((req.body as any).education !== undefined) profilePatch.education = `${(req.body as any).education || ""}`;
  if ((req.body as any).resumeUrl !== undefined) profilePatch.resumeUrl = `${(req.body as any).resumeUrl || ""}`;
  if ((req.body as any).bio !== undefined) profilePatch.bio = `${(req.body as any).bio || ""}`;
  if ((req.body as any).expectedSalaryMin !== undefined) profilePatch.expectedSalaryMin = parseNumber((req.body as any).expectedSalaryMin, 0);
  if ((req.body as any).expectedSalaryMax !== undefined) profilePatch.expectedSalaryMax = parseNumber((req.body as any).expectedSalaryMax, 0);
  if ((req.body as any).location !== undefined) profilePatch.location = `${(req.body as any).location || ""}`;
  if ((req.body as any).isPublic !== undefined) {
    profilePatch.isPublic = (req.body as any).isPublic === true || (req.body as any).isPublic === "true";
  }

  const profile = await CandidateProfile.findOneAndUpdate({ userId }, { $set: profilePatch }, { new: true, upsert: true, setDefaultsOnInsert: true });

  return {
    code: "success",
    message: "Cập nhật hồ sơ thành công!",
    profile,
  };
};

export const uploadResume = async (req: AccountRequest & { file?: Express.Multer.File }) => {
  const userId = req.account.id;
  const resumeUrl = req.file?.path || `${(req.body as any).resumeUrl || ""}`;

  if (!resumeUrl) {
    return { code: "error", message: "Vui lòng chọn file CV!" };
  }

  const profile = await CandidateProfile.findOneAndUpdate({ userId }, { $set: { resumeUrl } }, { new: true, upsert: true, setDefaultsOnInsert: true });

  return {
    code: "success",
    message: "Tải CV thành công!",
    profile,
  };
};
