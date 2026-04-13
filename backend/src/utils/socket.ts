import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { logger } from "./logger";

let io: Server | null = null;

export const initSocket = (httpServer: HttpServer, allowedOrigins: string[]) => {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", (payload: { userId: string }) => {
      const userId = `${payload?.userId || ""}`.trim();
      if (!userId) return;
      socket.join(`user:${userId}`);
    });

    socket.on("disconnect", () => {
      // noop
    });
  });

  logger.info("Socket.IO initialized");
  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
};

