"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.changePasswordPatch = exports.resetPassword = exports.verifyEmail = exports.forgotPassword = exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../user/user.model"));
const company_model_1 = __importDefault(require("../company/company.model"));
const forgotpassword_model_1 = __importDefault(require("./forgotpassword.model"));
const auth_model_1 = __importDefault(require("./auth.model"));
const mail_helper_1 = require("../../utils/mail.helper");
const token_util_1 = require("../../utils/token.util");
const password_util_1 = require("../../utils/password.util");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const city_model_1 = __importDefault(require("../city/city.model"));
const register = async (req) => {
    const { email, password, role } = req.body;
    const existUser = await user_model_1.default.findOne({ email });
    const existCompany = await company_model_1.default.findOne({ email });
    if (existUser || existCompany) {
        return {
            code: "error",
            message: "Email đã tồn tại trong hệ thống!",
        };
    }
    const hashedPassword = await (0, password_util_1.hashPassword)(password);
    if (role === "company") {
        const newCompany = new company_model_1.default({
            email,
            password: hashedPassword,
            ...req.body,
        });
        await newCompany.save();
    }
    else {
        const newUser = new user_model_1.default({
            email,
            password: hashedPassword,
            ...req.body,
        });
        await newUser.save();
    }
    return {
        code: "success",
        message: "Đăng ký thành công!",
    };
};
exports.register = register;
const login = async (req) => {
    const { email, password, rememberMe } = req.body;
    const isRemember = rememberMe === true || rememberMe === "true";
    let account = await user_model_1.default.findOne({ email });
    let role = "user";
    if (!account) {
        account = await company_model_1.default.findOne({ email });
        role = "company";
    }
    if (!account) {
        return {
            code: "error",
            message: "Email không tồn tại trong hệ thống!",
        };
    }
    const isPasswordValid = await (0, password_util_1.comparePassword)(password, `${account.password}`);
    if (!isPasswordValid) {
        return {
            code: "error",
            message: "Mật khẩu không đúng!",
        };
    }
    const payload = { id: account.id, role };
    const accessToken = (0, token_util_1.generateAccessToken)(payload);
    const refreshToken = (0, token_util_1.generateRefreshToken)(payload);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await auth_model_1.default.create({
        userId: account.id,
        token: refreshToken,
        expiresAt,
    });
    const commonInfo = {
        id: account.id,
        email: account.email,
    };
    if (role === "user") {
        commonInfo.fullName = account.fullName;
        commonInfo.avatar = account.avatar ?? null;
    }
    else if (role === "company") {
        commonInfo.companyName = account.companyName;
        commonInfo.logo = account.logo ?? null;
    }
    return {
        code: "success",
        message: "Đăng nhập thành công!",
        tokens: {
            accessToken,
            refreshToken,
            isRemember,
        },
        role,
        info: commonInfo,
    };
};
exports.login = login;
const refreshToken = async (req) => {
    const tokenFromCookie = req.cookies?.refreshToken;
    const tokenFromBody = req.body?.refreshToken;
    const refreshToken = tokenFromCookie || tokenFromBody;
    if (!refreshToken) {
        return {
            code: "error",
            message: "Vui lòng gửi kèm theo refresh token!",
        };
    }
    const existingToken = await auth_model_1.default.findOne({ token: refreshToken });
    if (!existingToken) {
        return {
            code: "error",
            message: "Refresh token không hợp lệ!",
        };
    }
    let decoded;
    try {
        decoded = (0, token_util_1.verifyRefreshToken)(refreshToken);
    }
    catch (error) {
        await auth_model_1.default.deleteOne({ _id: existingToken.id });
        return {
            code: "error",
            message: "Refresh token không hợp lệ!",
        };
    }
    const payload = decoded;
    let account = null;
    if (payload.role === "user") {
        account = await user_model_1.default.findById(payload.id);
    }
    else if (payload.role === "company") {
        account = await company_model_1.default.findById(payload.id);
    }
    if (!account) {
        await auth_model_1.default.deleteOne({ _id: existingToken.id });
        return {
            code: "error",
            message: "Tài khoản không tồn tại!",
        };
    }
    const newPayload = { id: account.id, role: payload.role };
    const newAccessToken = (0, token_util_1.generateAccessToken)(newPayload);
    const newRefreshToken = (0, token_util_1.generateRefreshToken)(newPayload);
    existingToken.token = newRefreshToken;
    existingToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await existingToken.save();
    return {
        code: "success",
        message: "Làm mới token thành công!",
        tokens: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        },
    };
};
exports.refreshToken = refreshToken;
const logout = async (req) => {
    const tokenFromCookie = req.cookies?.refreshToken;
    const refreshToken = tokenFromCookie;
    if (refreshToken) {
        await auth_model_1.default.deleteOne({ token: refreshToken });
    }
    return {
        code: "success",
        message: "Đã đăng xuất!",
    };
};
exports.logout = logout;
const forgotPassword = async (req) => {
    const { email } = req.body;
    let account = await user_model_1.default.findOne({ email });
    let accountType = "user";
    if (!account) {
        account = await company_model_1.default.findOne({ email });
        accountType = "company";
    }
    if (!account) {
        return {
            code: "error",
            message: "Email không tồn tại trong hệ thống!",
        };
    }
    const existingOTP = await forgotpassword_model_1.default.findOne({
        email,
        accountType,
    });
    if (existingOTP) {
        return {
            code: "error",
            message: "Mã OTP đã được gửi. Vui lòng kiểm tra email của bạn!",
        };
    }
    const characters = "0123456789";
    let otpCode = "";
    for (let i = 0; i < 6; i++) {
        otpCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const newRecord = new forgotpassword_model_1.default({
        email,
        otp: otpCode,
        accountType,
        expireAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await newRecord.save();
    const subject = "Mã OTP đặt lại mật khẩu";
    const content = `Mã OTP của bạn là: <b>${otpCode}</b>. Mã có hiệu lực trong 5 phút.`;
    await (0, mail_helper_1.sendMail)(email, subject, content);
    return {
        code: "success",
        message: "Đã gửi mã OTP đến email của bạn!",
    };
};
exports.forgotPassword = forgotPassword;
const verifyEmail = async (req) => {
    const { email, otp } = req.body;
    const existRecord = await forgotpassword_model_1.default.findOne({
        email,
        otp,
    });
    if (!existRecord) {
        return {
            code: "error",
            message: "Mã OTP không đúng hoặc đã hết hạn!",
        };
    }
    return {
        code: "success",
        message: "Xác thực email thành công!",
    };
};
exports.verifyEmail = verifyEmail;
const resetPassword = async (req) => {
    const { email, newPassword } = req.body;
    const existRecord = await forgotpassword_model_1.default.findOne({
        email,
    });
    if (!existRecord) {
        return {
            code: "error",
            message: "Mã OTP không đúng hoặc đã hết hạn!",
        };
    }
    await forgotpassword_model_1.default.deleteOne({ _id: existRecord.id });
    let account = await user_model_1.default.findOne({ email });
    if (!account) {
        account = await company_model_1.default.findOne({ email });
    }
    if (!account) {
        return {
            code: "error",
            message: "Tài khoản không tồn tại!",
        };
    }
    const hash = await (0, password_util_1.hashPassword)(newPassword);
    account.password = hash;
    await account.save();
    return {
        code: "success",
        message: "Đặt lại mật khẩu thành công!",
    };
};
exports.resetPassword = resetPassword;
const changePasswordPatch = async (req) => {
    const { currentPassword, newPassword } = req.body;
    const userPayload = req.user;
    if (!userPayload || userPayload.role !== "user") {
        return {
            code: "error",
            message: "Không có quyền đổi mật khẩu!",
        };
    }
    const account = await user_model_1.default.findById(userPayload.id);
    if (!account) {
        return {
            code: "error",
            message: "Tài khoản không tồn tại!",
        };
    }
    const isPasswordValid = await bcryptjs_1.default.compare(currentPassword, `${account.password}`);
    if (!isPasswordValid) {
        return {
            code: "error",
            message: "Mật khẩu hiện tại không đúng!",
        };
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    const hash = await bcryptjs_1.default.hash(newPassword, salt);
    account.password = hash;
    await account.save();
    return {
        code: "success",
        message: "Đổi mật khẩu thành công!",
    };
};
exports.changePasswordPatch = changePasswordPatch;
const me = async (userPayload, account) => {
    if (!userPayload || !account) {
        return {
            status: 401,
            data: {
                code: "error",
                message: "Vui lòng đăng nhập!",
            },
        };
    }
    const raw = typeof account.toObject === "function" ? account.toObject() : account;
    if (raw.password) {
        delete raw.password;
    }
    if (userPayload.role === "user") {
        return {
            status: 200,
            data: {
                code: "success",
                infoUser: {
                    fullName: raw.fullName,
                    email: raw.email,
                    phone: raw.phone,
                    birthday: raw.birthday,
                    gender: raw.gender,
                    address: raw.address,
                    experienceYears: raw.experienceYears,
                    currentPosition: raw.currentPosition,
                    desiredPosition: raw.desiredPosition,
                    skills: raw.skills,
                    education: raw.education,
                    socials: raw.socials,
                    avatar: raw.avatar,
                },
                infoCompany: null,
            },
        };
    }
    if (userPayload.role === "company") {
        let city = null;
        if (raw.city) {
            const cityDoc = await city_model_1.default.findById(raw.city).lean();
            if (cityDoc) {
                city = cityDoc.name;
            }
        }
        return {
            status: 200,
            data: {
                code: "success",
                infoUser: null,
                infoCompany: {
                    companyName: raw.companyName,
                    logo: raw.logo,
                    city: city,
                    address: raw.address,
                    companyModel: raw.companyModel,
                    companyEmployees: raw.companyEmployees,
                    workingTime: raw.workingTime,
                    workOvertime: raw.workOvertime,
                    email: raw.email,
                    phone: raw.phone,
                    description: raw.description,
                },
            },
        };
    }
    return {
        status: 400,
        data: {
            code: "error",
            message: "Không hỗ trợ loại tài khoản này!",
        },
    };
};
exports.me = me;
