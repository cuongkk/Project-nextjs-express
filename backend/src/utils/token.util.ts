import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  role: "user" | "company" | "admin";
}

const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";

const getAccessSecret = () => {
  const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT access secret is not defined");
  }
  return secret;
};

const getRefreshSecret = () => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT refresh secret is not defined");
  }
  return secret;
};

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, getAccessSecret(), {
    expiresIn: ACCESS_EXPIRES_IN,
  });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, getRefreshSecret(), {
    expiresIn: REFRESH_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, getAccessSecret()) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, getRefreshSecret()) as JwtPayload;
};
