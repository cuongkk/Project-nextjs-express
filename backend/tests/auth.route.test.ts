import express from "express";
import request from "supertest";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("../src/modules/auth/auth.validate", () => {
  const pass = (_req: any, _res: any, next: any) => next();
  return {
    registerPost: pass,
    loginPost: pass,
    refreshTokenPost: pass,
    forgotPasswordPost: pass,
    verifyEmailPost: pass,
    resetPasswordPost: pass,
    changePasswordPatch: pass,
  };
});

vi.mock("../src/middlewares/auth.middleware", () => ({
  authenticate: (_req: any, _res: any, next: any) => next(),
  verifyTokenUser: (_req: any, _res: any, next: any) => next(),
}));

vi.mock("../src/modules/auth/auth.controller", () => {
  const ok = (_req: any, res: any) => res.json({ code: "success" });
  return {
    register: ok,
    login: ok,
    me: ok,
    refreshToken: ok,
    logout: ok,
    forgotPassword: ok,
    verifyEmail: ok,
    resetPassword: ok,
    changePassword: ok,
  };
});

describe("auth routes", () => {
  let app: express.Express;

  beforeAll(async () => {
    const { default: router } = await import("../src/modules/auth/auth.route");
    app = express();
    app.use(express.json());
    app.use("/auth", router);
  });

  it("POST /auth/login should respond success", async () => {
    const res = await request(app).post("/auth/login").send({ email: "a@a.com", password: "A@123456" });
    expect(res.status).toBe(200);
    expect(res.body.code).toBe("success");
  });

  it("GET /auth/me should respond success", async () => {
    const res = await request(app).get("/auth/me");
    expect(res.status).toBe(200);
    expect(res.body.code).toBe("success");
  });
});
