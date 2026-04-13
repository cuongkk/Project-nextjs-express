"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { FaComments, FaXmark, FaBars } from "react-icons/fa6";
import { useAuth } from "@/hooks/useAuth";
import { useConversations, useMessages, useUnreadCount, type ConversationItem, type MessageItem } from "@/hooks/useApiData";
import { apiRequest } from "@/utils/api";

// Format time display
const formatTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins}p trước`;
    if (diffHours < 24) return `${diffHours}h trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

export const ChatWidget = () => {
  const { isLogin, infoUser, infoCompany } = useAuth();
  const myId = infoUser?.id || infoCompany?.id || "";
  const isCompany = !!infoCompany;

  const [open, setOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeId, setActiveId] = useState("");
  const [text, setText] = useState("");

  // Use optimized hooks with caching and deduplication
  const { conversations, mutate: mutateConversations } = useConversations();
  const { messages, mutate: mutateMessages } = useMessages(activeId);
  const { count: unreadCount, mutate: mutateUnread } = useUnreadCount();

  const socketRef = useRef<Socket | null>(null);
  const initializedRef = useRef(false);

  const activeConversation = useMemo(() => conversations.find((c) => c.id === activeId) || null, [conversations, activeId]);

  // Initialize active conversation on first load
  useEffect(() => {
    if (!initializedRef.current && conversations.length > 0 && !activeId) {
      setActiveId(conversations[0].id);
      initializedRef.current = true;
    }
  }, [conversations, activeId]);

  // Setup socket connection (only once)
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    if (!isLogin || !myId || !baseUrl || socketRef.current) return;

    const socket = io(baseUrl, { withCredentials: true });
    socketRef.current = socket;
    socket.emit("join", { userId: myId });

    socket.on("receive_message", (payload: any) => {
      const convId = payload?.conversationId;
      const msg = payload?.message;
      if (!convId || !msg) return;

      // Update conversations list with new message
      mutateConversations((prev) => {
        if (!prev) return prev;
        const updated = prev.conversations.map((c) => (c.id === convId ? { ...c, lastMessage: msg.content, lastMessageAt: msg.createdAt } : c));
        return { ...prev, conversations: updated };
      }, false);

      // Add message if viewing this conversation
      if (convId === activeId) {
        mutateMessages((prev) => {
          if (!prev) return prev;
          return { ...prev, messages: [...prev.messages, msg as MessageItem] };
        }, false);
      } else {
        // Increment unread count only if not viewing
        mutateUnread(
          (prev) => ({
            ...prev,
            count: (prev?.count || 0) + 1,
          }),
          false,
        );
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isLogin, myId, activeId, mutateConversations, mutateMessages, mutateUnread]);

  if (!isLogin) return null;

  const sendMessage = async () => {
    if (!activeId || !text.trim()) return;
    const content = text.trim();
    setText("");

    try {
      const res = await apiRequest<{ messageDoc: MessageItem }>("/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: activeId, content }),
      });

      if (res.code === "success" && (res as any).messageDoc) {
        const msg = (res as any).messageDoc;
        mutateMessages((prev) => {
          if (!prev) return prev;
          return { ...prev, messages: [...prev.messages, msg as MessageItem] };
        }, false);

        mutateConversations((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            conversations: prev.conversations.map((c) => (c.id === activeId ? { ...c, lastMessage: msg.content, lastMessageAt: msg.createdAt } : c)),
          };
        }, false);
      }
    } catch {
      // Error handled silently, user can retry
    }
  };

  const deleteConversation = async () => {
    if (!activeId) return;

    try {
      const res = await apiRequest(`/conversations/${activeId}`, { method: "DELETE" });
      if (res.code === "success") {
        const next = conversations.filter((c: ConversationItem) => c.id !== activeId);
        mutateConversations((prev) => (prev ? { ...prev, conversations: next } : prev), false);
        setActiveId(next[0]?.id || "");
        mutateMessages((prev) => (prev ? { ...prev, messages: [] } : prev), false);
        mutateUnread();
      }
    } catch {
      // Error handled silently
    }
  };

  return (
    <div className="fixed right-5 bottom-5 z-50">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-all"
      >
        <FaComments className="text-[22px]" />
        {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] rounded-full px-1.5 py-0.5 font-semibold">{unreadCount}</span>}
      </button>

      {open && (
        <div className="fixed right-5 bottom-24 w-[420px] h-[550px] bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-between items-center">
            <h3 className="font-bold text-base">Tin nhắn</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-1.5 hover:bg-blue-500 rounded-md transition-colors"
                title={showSidebar ? "Ẩn danh sách" : "Hiển thị danh sách"}
              >
                <FaBars size={16} />
              </button>
              <button type="button" onClick={() => setOpen(false)} className="p-1.5 hover:bg-blue-500 rounded-md transition-colors">
                <FaXmark size={16} />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex min-h-0 overflow-hidden">
            {/* Sidebar - Conversations List */}
            {showSidebar && (
              <div className="w-[140px] border-r border-gray-200 overflow-y-auto bg-gray-50">
                {conversations.length === 0 ? (
                  <div className="p-3 text-center text-gray-500 text-xs">Không có cuộc hội thoại</div>
                ) : (
                  conversations.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveId(c.id)}
                      className={`w-full text-left px-3 py-2.5 border-b border-gray-200 transition-all ${
                        activeId === c.id ? "bg-blue-100 border-l-4 border-l-blue-600" : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      <div className="text-xs font-semibold text-gray-900 line-clamp-2">{isCompany ? c.otherParticipantName : c.companyName}</div>
                      <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{c.jobTitle}</div>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Chat Content */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="font-semibold text-sm text-gray-900">{isCompany ? activeConversation?.otherParticipantName || "Ứng viên" : activeConversation?.companyName || "Công ty"}</div>
                <div className="text-xs text-gray-600 mt-1">{activeConversation?.jobTitle || ""}</div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-white">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 text-xs py-10">Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!</div>
                ) : (
                  messages.map((m) => (
                    <div key={m._id} className={`flex ${m.senderId === myId ? "justify-end" : "justify-start"} group`}>
                      <div className={`max-w-[75%] ${m.senderId === myId ? "text-right" : "text-left"}`}>
                        <div className={`px-3 py-2 rounded-lg text-xs ${m.senderId === myId ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-200 text-gray-900 rounded-bl-none"}`}>
                          {m.content}
                        </div>
                        <div className={`text-xs mt-1 ${m.senderId === myId ? "text-gray-400" : "text-gray-500"}`}>{formatTime(m.createdAt)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-gray-200 bg-gray-50 space-y-2">
                <div className="flex gap-2">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tin nhắn..."
                  />
                  <button type="button" onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                    Gửi
                  </button>
                </div>
                <button type="button" onClick={deleteConversation} className="w-full text-red-600 hover:text-red-700 text-xs font-medium py-1 transition-colors">
                  Xóa cuộc trò chuyện
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
