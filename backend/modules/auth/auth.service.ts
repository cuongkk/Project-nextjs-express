import { Request } from "express";
import jwt from "jsonwebtoken";
import AccountUser from "../user/user.model";
import AccountCompany from "../company/company.model";

export const check = async (req: Request) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    return {
      code: "error",
      message: "Token không hợp lệ!",
    };
  }

  let decoded: jwt.JwtPayload | null = null;

  if (accessToken) {
    try {
      decoded = jwt.verify(accessToken, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
    } catch (err: any) {
      if (err.name !== "TokenExpiredError") {
        throw err;
      }
    }
  }

  let fromRefresh = false;
  if (!decoded && refreshToken) {
    decoded = jwt.verify(refreshToken, `${process.env.JWT_REFRESH_SECRET}`) as jwt.JwtPayload;
    fromRefresh = true;
  }

  if (!decoded) {
    return {
      code: "error",
      message: "Token không hợp lệ!",
      clearCookies: true,
    } as any;
  }

  const { id, email } = decoded;

  const existAccountUser = await AccountUser.findOne({
    _id: id,
    email: email,
  });

  if (existAccountUser) {
    return {
      type: "user" as const,
      fromRefresh,
      info: {
        id: existAccountUser.id,
        fullName: existAccountUser.fullName,
        email: existAccountUser.email,
        avatar: existAccountUser.avatar,
      },
    };
  }

  const existAccountCompany = await AccountCompany.findOne({
    _id: id,
    email: email,
  });

  if (existAccountCompany) {
    return {
      type: "company" as const,
      fromRefresh,
      info: {
        id: existAccountCompany.id,
        companyName: existAccountCompany.companyName,
        email: existAccountCompany.email,
        city: existAccountCompany.city,
        address: existAccountCompany.address,
        companyEmployees: existAccountCompany.companyEmployees,
        workingTime: existAccountCompany.workingTime,
        phone: existAccountCompany.phone,
        description: existAccountCompany.description,
        logo: existAccountCompany.logo,
      },
    };
  }

  return {
    code: "error",
    message: "Token không hợp lệ!",
    clearCookies: true,
  } as any;
};

export const authCompanyCheck = async (req: Request) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    return {
      code: "error",
      message: "Token không hợp lệ!",
    };
  }

  let decoded: jwt.JwtPayload | null = null;

  if (accessToken) {
    try {
      decoded = jwt.verify(accessToken, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
    } catch (err: any) {
      if (err.name !== "TokenExpiredError") {
        throw err;
      }
    }
  }

  let fromRefresh = false;
  if (!decoded && refreshToken) {
    decoded = jwt.verify(refreshToken, `${process.env.JWT_REFRESH_SECRET}`) as jwt.JwtPayload;
    fromRefresh = true;
  }

  if (!decoded) {
    return {
      code: "error",
      message: "Token không hợp lệ!",
      clearCookies: true,
    } as any;
  }

  const { id, email } = decoded;

  const existAccountCompany = await AccountCompany.findOne({
    _id: id,
    email: email,
  });

  if (!existAccountCompany) {
    return {
      code: "error",
      message: "Token không hợp lệ!",
      clearCookies: true,
    } as any;
  }

  return {
    fromRefresh,
    infoCompany: {
      id: existAccountCompany.id,
      companyName: existAccountCompany.companyName,
      email: existAccountCompany.email,
    },
  };
};
