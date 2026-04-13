"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { io, type Socket } from "socket.io-client";
import { apiRequest } from "@/utils/api";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";

type ConversationItem = {
  id: string;
  jobId: string;
  jobTitle: string;
  companyId?: string;
  companyName?: string;
  otherParticipantId?: string;
  otherParticipantName?: string;
  lastMessage?: string;
  lastMessageAt?: string;
};

type MessageItem = {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
};

export default function ChatPage() {
  usePageTitle("Chat");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLogin, isAuthLoaded, infoUser, infoCompany } = useAuth();

  const myId = infoUser?.id || infoCompany?.id || "";

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [text, setText] = useState("");
  const [isDirectMode, setIsDirectMode] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const hasLoadedRef = useRef(false);
  const sentMessageIdsRef = useRef<Set<string>>(new Set());

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const selectedConversation = useMemo(() => conversations.find((c) => c.id === activeId) || null, [conversations, activeId]);

  const fetchConversations = async () => {
    const res = await apiRequest<{ conversations: ConversationItem[] }>("/conversations");
    if (res.code === "success" && Array.isArray((res as any).conversations)) {
      setConversations((res as any).conversations);
      return (res as any).conversations as ConversationItem[];
    }
    return [];
  };

  const fetchMessages = async (conversationId: string) => {
    const res = await apiRequest<{ messages: MessageItem[] }>(`/messages/${conversationId}`);
    if (res.code === "success" && Array.isArray((res as any).messages)) {
      setMessages((res as any).messages);
    } else {
      setMessages([]);
    }
  };

  const ensureConversationFromQuery = async (currentConversations: ConversationItem[]) => {
    const jobId = searchParams.get("jobId") || "";
    const userId = searchParams.get("userId") || "";
    if (!jobId || !userId) {
      setIsDirectMode(false);
      return;
    }
    setIsDirectMode(true);

    const existing = currentConversations.find((c) => c.jobId === jobId && c.otherParticipantId === userId);
    if (existing?.id) {
      setActiveId(existing.id);
      return;
    }

    // Company can initiate if conversation not found
    if (!infoCompany) return;

    const res = await apiRequest<{ conversation: { id: string } }>("/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, userId }),
    });

    if (res.code === "success" && (res as any).conversation?.id) {
      const id = (res as any).conversation.id as string;
      setActiveId(id);
      const newList = await fetchConversations();
      const created = newList.find((c) => c.id === id);
      if (created) setConversations(newList);
    }
  };

  useEffect(() => {
    if (hasLoadedRef.current) return;
    if (!isAuthLoaded) return;
    if (!isLogin || (!infoUser && !infoCompany)) {
      router.replace("/login");
      return;
    }
    hasLoadedRef.current = true;
    (async () => {
      const list = await fetchConversations();
      await ensureConversationFromQuery(list);
      if (!searchParams.get("jobId") && list.length > 0) {
        setActiveId((prev) => prev || list[0].id);
      }
    })();
  }, [isAuthLoaded, isLogin, infoUser, infoCompany, router, searchParams]);

  useEffect(() => {
    if (!activeId) return;
    fetchMessages(activeId);
  }, [activeId]);

  useEffect(() => {
    if (!baseUrl || !myId) return;
    if (socketRef.current) return;

    const socket = io(baseUrl, { withCredentials: true });
    socketRef.current = socket;

    socket.emit("join", { userId: myId });

    socket.on("receive_message", (payload: any) => {
      const convId = payload?.conversationId;
      const msg = payload?.message;
      if (!convId || !msg) return;
      if (sentMessageIdsRef.current.has(msg._id)) return;

      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, lastMessage: msg.content, lastMessageAt: msg.createdAt } : c)),
      );

      if (convId === activeId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [baseUrl, myId, activeId]);

  const handleSend = async () => {
    if (!activeId) return;
    const content = text.trim();
    if (!content) return;
    setText("");

    const res = await apiRequest<{ messageDoc: MessageItem }>("/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: activeId, content }),
    });

    if (res.code === "success" && (res as any).messageDoc) {
      const messageDoc = (res as any).messageDoc as MessageItem;
      sentMessageIdsRef.current.add(messageDoc._id);
      setMessages((prev) => [...prev, messageDoc]);
      setConversations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, lastMessage: messageDoc.content, lastMessageAt: messageDoc.createdAt } : c)),
      );
    }
  };

  const displayTitle = useMemo(() => {
    if (!selectedConversation) return "Chat";
    if (infoCompany) {
      return selectedConversation.otherParticipantName || "Ứng viên";
    }
    return selectedConversation.companyName || "Công ty";
  }, [selectedConversation, infoCompany]);

  const displaySubTitle = selectedConversation?.jobTitle || "";

  const handleDeleteConversation = async () => {
    if (!activeId) return;
    const ok = window.confirm("Xóa cuộc trò chuyện này?");
    if (!ok) return;
    const res = await apiRequest(`/conversations/${activeId}`, { method: "DELETE" });
    if (res.code === "success") {
      setConversations((prev) => prev.filter((c) => c.id !== activeId));
      setMessages([]);
      setActiveId("");
    }
  };

  return (
    <div className="py-[40px]">
      <div className="contain">
        <div className={`grid grid-cols-1 ${isDirectMode ? "" : "lg:grid-cols-3"} gap-[16px]`}>
          {!isDirectMode && (
            <div className="border border-[#DEDEDE] rounded-[8px] overflow-hidden">
            <div className="px-3 py-2 border-b font-[700]">Conversations</div>
            <div className="max-h-[70vh] overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="px-3 py-3 text-[13px] text-gray-500">Chưa có cuộc trò chuyện.</div>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveId(c.id)}
                    className={`w-full text-left px-3 py-2 border-b last:border-b-0 ${activeId === c.id ? "bg-[#EEF2FF]" : "bg-white"}`}
                  >
                    <div className="font-[700] text-[14px] line-clamp-1">{c.jobTitle || "Job"}</div>
                    <div className="text-[12px] text-gray-600 line-clamp-1">{c.companyName || c.otherParticipantName || ""}</div>
                    <div className="text-[12px] text-gray-500 line-clamp-1">{c.lastMessage || ""}</div>
                  </button>
                ))
              )}
            </div>
            </div>
          )}

          <div className={`${isDirectMode ? "" : "lg:col-span-2"} border border-[#DEDEDE] rounded-[8px] overflow-hidden flex flex-col`}>
            <div className="px-3 py-2 border-b flex items-start justify-between gap-3">
              <div>
                <div className="font-[700]">{displayTitle}</div>
                <div className="text-[12px] text-gray-600">{displaySubTitle}</div>
              </div>
              {activeId && (
                <button type="button" onClick={handleDeleteConversation} className="text-[12px] text-red-600 hover:underline">
                  Delete chat
                </button>
              )}
            </div>

            <div className="flex-1 max-h-[60vh] overflow-y-auto px-3 py-3 flex flex-col gap-2">
              {activeId ? (
                messages.map((m) => (
                  <div key={m._id} className={`max-w-[80%] px-3 py-2 rounded ${m.senderId === myId ? "ml-auto bg-[#DBEAFE]" : "bg-[#F3F4F6]"}`}>
                    <div className="text-[13px] whitespace-pre-wrap">{m.content}</div>
                  </div>
                ))
              ) : (
                <div className="text-[13px] text-gray-500">Chọn một cuộc trò chuyện để bắt đầu.</div>
              )}
            </div>

            <div className="border-t p-3 flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 border border-[#DEDEDE] rounded-[6px] px-3 py-2 text-[14px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
              />
              <button type="button" onClick={handleSend} className="bg-primary text-white rounded-[6px] px-4 py-2 text-[14px] font-[700]">
                Gửi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

