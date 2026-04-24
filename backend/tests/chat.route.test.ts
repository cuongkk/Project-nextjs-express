import express from "express";
import request from "supertest";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("../src/middlewares/auth.middleware", () => ({
  authenticate: (_req: any, _res: any, next: any) => next(),
}));

vi.mock("../src/modules/chat/chat.controller", () => {
  const ok = (_req: any, res: any) => res.json({ code: "success" });
  return {
    listConversations: ok,
    unreadCount: ok,
    createConversation: ok,
    removeConversation: ok,
    listMessages: ok,
    sendMessage: ok,
  };
});

describe("chat routes", () => {
  let app: express.Express;

  beforeAll(async () => {
    const { default: router } = await import("../src/modules/chat/chat.route");
    app = express();
    app.use(express.json());
    app.use("/", router);
  });

  it("GET /conversations should respond success", async () => {
    const res = await request(app).get("/conversations");
    expect(res.status).toBe(200);
    expect(res.body.code).toBe("success");
  });

  it("POST /messages should respond success", async () => {
    const res = await request(app).post("/messages").send({ conversationId: "1", content: "hello" });
    expect(res.status).toBe(200);
    expect(res.body.code).toBe("success");
  });
});
