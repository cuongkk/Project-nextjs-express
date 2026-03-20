import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import AccountUser from "../models/account-user.model";
import AccountCompany from "../models/account-company.model";

export const check = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.json({
        code: "error",
        message: "Token không hợp lệ!",
      });
      return;
    }

    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload; // Giải mã token

    const { id, email } = decoded;

    // Ưu tiên kiểm tra tài khoản user
    const existAccountUser = await AccountUser.findOne({
      _id: id,
      email: email,
    });

    if (existAccountUser) {
      const infoUser = {
        id: existAccountUser.id,
        fullName: existAccountUser.fullName,
        email: existAccountUser.email,
        avatar: existAccountUser.avatar,
        phone: existAccountUser.phone,
      };

      res.json({
        code: "success",
        message: "Token hợp lệ!",
        infoUser: infoUser,
      });
      return;
    }

    // Nếu không phải user thì kiểm tra tài khoản company
    const existAccountCompany = await AccountCompany.findOne({
      _id: id,
      email: email,
    });

    if (existAccountCompany) {
      const infoCompany = {
        id: existAccountCompany.id,
        companyName: existAccountCompany.companyName,
        email: existAccountCompany.email,
      };

      res.json({
        code: "success",
        message: "Token hợp lệ!",
        infoCompany: infoCompany,
      });
      return;
    }

    // Không tìm thấy ở cả 2 collection
    res.clearCookie("token");
    res.json({
      code: "error",
      message: "Token không hợp lệ!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Token không hợp lệ!",
    });
  }
};

export const authCompanyCheck = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.json({
        code: "error",
        message: "Token không hợp lệ!",
      });
      return;
    }

    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;

    const { id, email } = decoded;

    const existAccountCompany = await AccountCompany.findOne({
      _id: id,
      email: email,
    });

    if (!existAccountCompany) {
      res.clearCookie("token");

      res.json({
        code: "error",
        message: "Token không hợp lệ!",
      });
      return;
    }

    const infoCompany = {
      id: existAccountCompany.id,
      companyName: existAccountCompany.companyName,
      email: existAccountCompany.email,
    };

    res.json({
      code: "success",
      message: "Token hợp lệ!",
      infoCompany: infoCompany,
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Token không hợp lệ!",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({
    code: "success",
    message: "Đã đăng xuất!",
  });
};
