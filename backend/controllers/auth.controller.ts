import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import AccountUser from "../models/account-user.model";
import AccountCompany from "../models/account-company.model";

export const check = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      res.json({
        code: "error",
        message: "Token không hợp lệ!",
      });
      return;
    }

    let decoded: jwt.JwtPayload | null = null;

    // Thử verify accessToken trước
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
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.json({
        code: "error",
        message: "Token không hợp lệ!",
      });
      return;
    }

    const { id, email } = decoded;

    // Ưu tiên kiểm tra tài khoản user
    const existAccountUser = await AccountUser.findOne({
      _id: id,
      email: email,
    });

    if (existAccountUser) {
      // Nếu xác thực bằng refreshToken thì cấp lại accessToken mới
      if (fromRefresh) {
        const newAccessToken = jwt.sign(
          {
            id: existAccountUser.id,
            email: existAccountUser.email,
          },
          `${process.env.JWT_SECRET}`,
          {
            expiresIn: "15m",
          },
        );

        res.cookie("accessToken", newAccessToken, {
          maxAge: 15 * 60 * 1000,
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
      }

      const infoUser = {
        id: existAccountUser.id,
        fullName: existAccountUser.fullName,
        email: existAccountUser.email,
        avatar: existAccountUser.avatar,
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
      if (fromRefresh) {
        const newAccessToken = jwt.sign(
          {
            id: existAccountCompany.id,
            email: existAccountCompany.email,
          },
          `${process.env.JWT_SECRET}`,
          {
            expiresIn: "15m",
          },
        );

        res.cookie("accessToken", newAccessToken, {
          maxAge: 15 * 60 * 1000,
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
      }

      const infoCompany = {
        id: existAccountCompany.id,
        companyName: existAccountCompany.companyName,
        email: existAccountCompany.email,
        city: existAccountCompany.city,
        address: existAccountCompany.address,
        companyModel: existAccountCompany.companyModel,
        companyEmployees: existAccountCompany.companyEmployees,
        workingTime: existAccountCompany.workingTime,
        workOvertime: existAccountCompany.workOvertime,
        phone: existAccountCompany.phone,
        description: existAccountCompany.description,
        logo: existAccountCompany.logo,
      };

      res.json({
        code: "success",
        message: "Token hợp lệ!",
        infoCompany: infoCompany,
      });
      return;
    }

    // Không tìm thấy ở cả 2 collection
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
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
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      res.json({
        code: "error",
        message: "Token không hợp lệ!",
      });
      return;
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
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.json({
        code: "error",
        message: "Token không hợp lệ!",
      });
      return;
    }

    const { id, email } = decoded;

    const existAccountCompany = await AccountCompany.findOne({
      _id: id,
      email: email,
    });

    if (!existAccountCompany) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.json({
        code: "error",
        message: "Token không hợp lệ!",
      });
      return;
    }

    if (fromRefresh) {
      const newAccessToken = jwt.sign(
        {
          id: existAccountCompany.id,
          email: existAccountCompany.email,
        },
        `${process.env.JWT_SECRET}`,
        {
          expiresIn: "15m",
        },
      );

      res.cookie("accessToken", newAccessToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
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
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({
    code: "success",
    message: "Đã đăng xuất!",
  });
};
