import express from "express";
import request from "supertest";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("../src/middlewares/auth.middleware", () => ({
  verifyTokenUser: (_req: any, _res: any, next: any) => next(),
  verifyTokenCompany: (_req: any, _res: any, next: any) => next(),
  authenticate: (_req: any, _res: any, next: any) => next(),
}));

vi.mock("../src/utils/cloudinary.helper", () => ({
  upload: {
    single: () => (_req: any, _res: any, next: any) => next(),
  },
}));

vi.mock("../src/middlewares/upload-cloudinary.middleware", () => ({
  uploadCloudinaryMiddleware: (_req: any, _res: any, next: any) => next(),
}));

vi.mock("../src/modules/application/application.validate", () => ({
  applyPost: (_req: any, _res: any, next: any) => next(),
  companyChangeStatusPatch: (_req: any, _res: any, next: any) => next(),
  companySetInterviewDatePatch: (_req: any, _res: any, next: any) => next(),
}));

vi.mock("../src/modules/application/application.controller", () => {
  const ok = (_req: any, res: any) => res.json({ code: "success" });
  return {
    apply: ok,
    list: ok,
    detail: ok,
    companyChangeStatus: ok,
    companySetInterviewDate: ok,
    removeByUser: ok,
  };
});

describe("application routes", () => {
  let app: express.Express;

  beforeAll(async () => {
    const { default: router } = await import("../src/modules/application/application.route");
    app = express();
    app.use(express.json());
    app.use("/applications", router);
  });

  it("POST /applications should respond success", async () => {
    const res = await request(app).post("/applications");
    expect(res.status).toBe(200);
    expect(res.body.code).toBe("success");
  });

  it("PATCH /applications/:id should respond success", async () => {
    const res = await request(app).patch("/applications/abc").send({ status: "screening" });
    expect(res.status).toBe(200);
    expect(res.body.code).toBe("success");
  });
});
