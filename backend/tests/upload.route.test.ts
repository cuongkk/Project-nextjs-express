import express from "express";
import request from "supertest";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("../src/utils/cloudinary.helper", () => ({
  upload: {
    single: () => (req: any, _res: any, next: any) => {
      req.file = { path: "https://cdn.example/file.png" };
      next();
    },
  },
}));

vi.mock("../src/middlewares/upload-cloudinary.middleware", () => ({
  uploadCloudinaryMiddleware: (_req: any, _res: any, next: any) => next(),
}));

vi.mock("../src/modules/upload/upload.controller", () => ({
  imagePost: (req: any, res: any) => res.json({ code: "success", url: req.file?.path || null }),
}));

describe("upload routes", () => {
  let app: express.Express;

  beforeAll(async () => {
    const { default: router } = await import("../src/modules/upload/upload.route");
    app = express();
    app.use(express.json());
    app.use("/uploads", router);
  });

  it("POST /uploads should return uploaded url", async () => {
    const res = await request(app).post("/uploads");
    expect(res.status).toBe(200);
    expect(res.body.code).toBe("success");
    expect(res.body.url).toContain("https://");
  });

  it("POST /uploads/images should return uploaded url", async () => {
    const res = await request(app).post("/uploads/images");
    expect(res.status).toBe(200);
    expect(res.body.code).toBe("success");
    expect(res.body.url).toContain("https://");
  });
});
