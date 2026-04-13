import { Response } from "express";
import { AccountRequest } from "../../interfaces/request.interface";
import * as chatService from "./chat.service";

export const listConversations = async (req: AccountRequest, res: Response) => {
  const result = await chatService.listConversations(req);
  res.json(result);
};

export const createConversation = async (req: AccountRequest, res: Response) => {
  const result = await chatService.createOrGetConversation(req);
  res.json(result);
};

export const listMessages = async (req: AccountRequest, res: Response) => {
  const result = await chatService.listMessages(req);
  res.json(result);
};

export const sendMessage = async (req: AccountRequest, res: Response) => {
  const result = await chatService.sendMessage(req);
  res.json(result);
};

export const unreadCount = async (req: AccountRequest, res: Response) => {
  const result = await chatService.getUnreadCount(req);
  res.json(result);
};

export const removeConversation = async (req: AccountRequest, res: Response) => {
  const result = await chatService.deleteConversation(req);
  res.json(result);
};

