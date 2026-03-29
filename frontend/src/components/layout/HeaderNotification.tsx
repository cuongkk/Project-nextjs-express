"use client";

// ADDED: Header notification bell with badge, dropdown and optimistic read-all

import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa6";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface NotificationItem {
  _id: string;
  type: "CV_ACCEPTED" | "NEW_APPLICATION";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface ListResponse {
  code: string;
  notifications?: NotificationItem[];
}

interface CountResponse {
  code: string;
  count?: number;
}

export const HeaderNotification = () => {
  const [count, setCount] = useState<number>(0);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [isReading, setIsReading] = useState(false);

  // ADDED: fetch badge count once on mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/count`, {
          credentials: "include",
        });
        const data: CountResponse = await res.json();
        if (data.code === "success" && typeof data.count === "number") {
          setCount(data.count);
        }
      } catch {
        // ignore
      }
    };

    fetchCount();
  }, []);

  const fetchList = async () => {
    setLoadingList(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
        credentials: "include",
      });
      const data: ListResponse = await res.json();
      if (data.code === "success" && Array.isArray(data.notifications)) {
        setItems(data.notifications);
      }
    } catch {
      // ignore
    } finally {
      setLoadingList(false);
    }
  };

  const handleToggle = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen) {
      // ADDED: on hover-like open, fetch list
      await fetchList();
    }
  };

  const handleReadAll = async () => {
    if (isReading) return;
    setIsReading(true);
    const previousCount = count;
    setCount(0); // optimistic

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`, {
        method: "PATCH",
        credentials: "include",
      });
      // keep items in UI; badge cleared optimistically, will reappear if server still counts later
    } catch {
      setCount(previousCount); // rollback on error
    } finally {
      setIsReading(false);
    }
  };

  return (
    <div className="relative group mr-3">
      <button type="button" className="relative text-white text-[20px] flex items-center justify-center" onClick={handleReadAll} onMouseEnter={handleToggle} onMouseLeave={() => setOpen(false)}>
        <FaBell />
        {count > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] leading-none text-white rounded-full px-1.5 py-0.5">{count}</span>}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[320px] bg-white text-black rounded shadow-lg overflow-hidden z-50" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
          <div className="px-3 py-2 border-b flex items-center justify-between text-[14px] font-[600]">
            <span>Thông báo</span>
            <button type="button" onClick={handleReadAll} className="text-[12px] text-blue-600 hover:underline disabled:text-gray-400" disabled={isReading}>
              Đánh dấu đã đọc
            </button>
          </div>
          <div className="max-h-[260px] overflow-y-auto">
            {loadingList ? (
              <div className="px-3 py-3 text-[13px] text-gray-500">Đang tải...</div>
            ) : items.length === 0 ? (
              <div className="px-3 py-3 text-[13px] text-gray-500">Không có thông báo.</div>
            ) : (
              items.map((item) => (
                <div key={item._id} className={`px-3 py-2 text-[13px] border-b last:border-b-0 ${item.read ? "bg-white" : "bg-[#EEF2FF]"}`}>
                  <div className="font-[600] mb-0.5">{item.title}</div>
                  <div className="text-[12px] text-gray-700 mb-0.5">{item.message}</div>
                  <div className="text-[11px] text-gray-400">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: vi })}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
