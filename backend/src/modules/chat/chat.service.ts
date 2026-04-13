import { AccountRequest } from "../../interfaces/request.interface";
import Conversation from "./conversation.model";
import Message from "./message.model";
import Job from "../job/job.model";
import AccountCompany from "../company/company.model";
import AccountUser from "../user/user.model";
import { getIO } from "../../utils/socket";
import { createNotification } from "../notificaion/notification.service";

const asId = (v: unknown) => `${v || ""}`.trim();

export const listConversations = async (req: AccountRequest) => {
  const myId = req.account?.id;
  if (!myId) return { code: "error", message: "Unauthorized" };

  const list = await Conversation.find({ participants: myId }).sort({ lastMessageAt: -1, updatedAt: -1 }).limit(50).lean();

  const jobIds = Array.from(new Set(list.map((c: any) => asId(c.jobId)))).filter(Boolean);
  const jobs = await Job.find({ _id: { $in: jobIds } })
    .select("_id title companyId companyName")
    .lean();
  const jobMap = new Map(jobs.map((j: any) => [asId(j._id), j]));

  const companyIds = Array.from(new Set(jobs.map((j: any) => asId(j.companyId)))).filter(Boolean);
  const companies = await AccountCompany.find({ _id: { $in: companyIds } })
    .select("_id companyName logo")
    .lean();
  const companyMap = new Map(companies.map((c: any) => [asId(c._id), c]));

  const userIds = Array.from(new Set(list.flatMap((c: any) => (Array.isArray(c.participants) ? c.participants : [])))).filter(Boolean);
  const users = await AccountUser.find({ _id: { $in: userIds } })
    .select("_id fullName name avatar")
    .lean();
  const userMap = new Map(users.map((u: any) => [asId(u._id), u]));

  const conversations = list.map((conv: any) => {
    const job = jobMap.get(asId(conv.jobId));
    const company = job ? companyMap.get(asId(job.companyId)) : null;

    const otherId = (Array.isArray(conv.participants) ? conv.participants : []).find((p: string) => asId(p) !== myId) || "";
    const otherUser = userMap.get(asId(otherId));

    return {
      myId: myId,
      id: asId(conv._id),
      jobId: asId(conv.jobId),
      jobTitle: job?.title || "",
      companyId: job?.companyId || "",
      companyName: job?.companyName || company?.companyName || "",
      companyLogo: company?.logo || "",
      otherParticipantId: otherId,
      otherParticipantName: otherUser?.fullName || otherUser?.name || "",
      lastMessage: conv.lastMessage || "",
      lastMessageAt: conv.lastMessageAt || conv.updatedAt,
      createdAt: conv.createdAt,
    };
  });

  return { code: "success", message: "OK", conversations };
};

export const createOrGetConversation = async (req: AccountRequest) => {
  const myId = req.account?.id;
  const myRole = req.user?.role;
  if (!myId || !myRole) return { code: "error", message: "Unauthorized" };
  if (myRole !== "company") return { code: "error", message: "Chỉ nhà tuyển dụng có thể chủ động tạo cuộc trò chuyện!" };

  const jobId = asId((req.body as any)?.jobId);
  if (!jobId) return { code: "error", message: "Thiếu jobId!" };

  const otherId = asId((req.body as any)?.userId);
  if (!otherId) return { code: "error", message: "Thiếu participant!" };

  const participants = [myId, otherId].sort();

  let conv = await Conversation.findOne({ jobId, participants: { $all: participants }, $expr: { $eq: [{ $size: "$participants" }, 2] } });
  if (!conv) {
    conv = await Conversation.create({
      jobId,
      participants,
      lastMessage: "",
      lastMessageAt: null,
    });
  }

  return {
    code: "success",
    message: "OK",
    conversation: {
      id: asId(conv._id),
      jobId: asId(conv.jobId),
      participants: conv.participants,
      lastMessage: conv.lastMessage || "",
      lastMessageAt: conv.lastMessageAt,
    },
  };
};

export const listMessages = async (req: AccountRequest) => {
  const myId = req.account?.id;
  if (!myId) return { code: "error", message: "Unauthorized" };

  const conversationId = asId(req.params.conversationId);
  const conv = await Conversation.findById(conversationId).lean();
  if (!conv || !Array.isArray((conv as any).participants) || !(conv as any).participants.includes(myId)) {
    return { code: "error", message: "Không có quyền truy cập!" };
  }

  const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }).limit(200).lean();
  await Message.updateMany({ conversationId, seenBy: { $ne: myId } }, { $addToSet: { seenBy: myId } });

  return { code: "success", message: "OK", messages };
};

export const sendMessage = async (req: AccountRequest) => {
  const myId = req.account?.id;
  const myRole = req.user?.role;
  if (!myId || !myRole) return { code: "error", message: "Unauthorized" };

  const conversationId = asId((req.body as any)?.conversationId);
  const content = `${(req.body as any)?.content || ""}`.trim();
  if (!conversationId || !content) return { code: "error", message: "Thiếu dữ liệu!" };

  const conv = await Conversation.findById(conversationId);
  if (!conv || !Array.isArray(conv.participants) || !conv.participants.includes(myId)) {
    return { code: "error", message: "Không có quyền truy cập!" };
  }

  const msg = await Message.create({
    conversationId,
    senderId: myId,
    content,
    seenBy: [myId],
  });

  conv.lastMessage = content;
  conv.lastMessageAt = msg.createdAt;
  await conv.save();

  const receiverId = conv.participants.find((p) => asId(p) !== myId) || "";
  if (receiverId) {
    try {
      await createNotification({
        receiverId,
        receiverType: myRole === "user" ? "company" : "user",
        type: "new_message",
        title: "Tin nhắn mới",
        message: content.length > 80 ? `${content.slice(0, 80)}...` : content,
        data: { conversationId, senderId: myId },
      });
    } catch {}

    try {
      const io = getIO();
      io.to(`user:${receiverId}`).emit("receive_message", {
        conversationId,
        message: msg,
      });
    } catch {}
  }

  return { code: "success", message: "OK", messageDoc: msg };
};

export const getUnreadCount = async (req: AccountRequest) => {
  const myId = req.account?.id;
  if (!myId) return { code: "error", message: "Unauthorized" };

  const myConversations = await Conversation.find({ participants: myId }).select("_id").lean();
  const conversationIds = myConversations.map((c: any) => asId(c._id));

  if (conversationIds.length === 0) {
    return { code: "success", message: "OK", count: 0 };
  }

  const count = await Message.countDocuments({
    conversationId: { $in: conversationIds },
    senderId: { $ne: myId },
    seenBy: { $ne: myId },
  });

  return { code: "success", message: "OK", count };
};

export const deleteConversation = async (req: AccountRequest) => {
  const myId = req.account?.id;
  if (!myId) return { code: "error", message: "Unauthorized" };

  const conversationId = asId(req.params.id);
  const conv = await Conversation.findById(conversationId);

  if (!conv || !Array.isArray(conv.participants) || !conv.participants.includes(myId)) {
    return { code: "error", message: "Không có quyền truy cập!" };
  }

  await Message.deleteMany({ conversationId });
  await Conversation.deleteOne({ _id: conversationId });

  return { code: "success", message: "Đã xóa cuộc trò chuyện!" };
};
