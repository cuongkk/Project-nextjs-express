import { Router } from "express";
import * as authMiddleware from "../../middlewares/auth.middleware";
import * as chatController from "./chat.controller";

const router = Router();

router.get("/conversations", authMiddleware.authenticate, chatController.listConversations);
router.get("/conversations/unread-count", authMiddleware.authenticate, chatController.unreadCount);
router.post("/conversations", authMiddleware.authenticate, chatController.createConversation);
router.delete("/conversations/:id", authMiddleware.authenticate, chatController.removeConversation);

router.get("/messages/:conversationId", authMiddleware.authenticate, chatController.listMessages);
router.post("/messages", authMiddleware.authenticate, chatController.sendMessage);

export default router;

