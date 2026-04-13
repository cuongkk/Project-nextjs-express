"use client";

import useSWR from "swr";
import { apiRequest, clearApiCache } from "@/utils/api";

export type ConversationItem = {
  id: string;
  jobTitle?: string;
  companyName?: string;
  otherParticipantName?: string;
  lastMessage?: string;
  lastMessageAt?: string;
};

export type MessageItem = {
  _id: string;
  senderId: string;
  content: string;
  createdAt: string;
};

type ConversationsResponse = {
  conversations: ConversationItem[];
};

type MessagesResponse = {
  messages: MessageItem[];
};

type UnreadCountResponse = {
  count: number;
};

type UserProfileResponse = {
  data: {
    user?: {
      name?: string;
    };
    profile?: {
      skills?: string[];
      experienceYears?: number;
      education?: string;
      bio?: string;
      expectedSalaryMin?: number;
      expectedSalaryMax?: number;
      location?: string;
      isPublic?: boolean;
      resumeUrl?: string;
    };
  };
};

type MenuDataResponse = {
  techList: string[];
  listCity: Array<{ name: string }>;
  companies: Array<{ companyName: string }>;
  title: string[];
};

export type ApplicationItem = {
  id: string;
  createdAt?: string;
  status?: string;
  jobTitle?: string;
  companyName?: string;
  candidateName?: string;
  candidateEmail?: string;
  candidatePhone?: string;
  userId?: string;
  jobId?: string;
};

type CVListResponse = {
  applications: ApplicationItem[];
  totalPage: number;
};

const fetcher = async <T>(url: string): Promise<T> => {
  const result = await apiRequest<T>(url);
  if (result.code === "success") {
    return result as T;
  }
  throw new Error(result.message || "API request failed");
};

// Hook for fetching conversations
export function useConversations() {
  const { data, error, isLoading, mutate } = useSWR<ConversationsResponse>("/conversations", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    focusThrottleInterval: 60000,
  });

  return {
    conversations: data?.conversations || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Hook for fetching messages
export function useMessages(conversationId: string) {
  const { data, error, isLoading, mutate } = useSWR<MessagesResponse>(conversationId ? `/messages/${conversationId}` : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });

  return {
    messages: data?.messages || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Hook for unread count
export function useUnreadCount() {
  const { data, error, isLoading, mutate } = useSWR<UnreadCountResponse>("/conversations/unread-count", fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 30000, // Poll every 30 seconds instead of 3
    dedupingInterval: 10000,
  });

  return {
    count: data?.count || 0,
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Hook for user profile
export function useUserProfile() {
  const { data, error, isLoading, mutate } = useSWR<UserProfileResponse>("/profile/me", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  return {
    profile: data?.data || null,
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Hook for menu data (jobs, skills, cities, etc.)
export function useMenuData() {
  const { data, error, isLoading, mutate } = useSWR<MenuDataResponse>("/jobs/all", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // Cache for 5 minutes
  });

  return {
    techList: data?.techList || [],
    listCity: data?.listCity || [],
    companies: data?.companies || [],
    title: data?.title || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Hook for applications/CVs
export function useCVList(page: number, sortOrder: "newest" | "oldest", statusFilter: string, jobIdFilter?: string | null) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("sort", sortOrder === "oldest" ? "oldest" : "newest");
  if (statusFilter !== "all") params.set("status", statusFilter);
  if (jobIdFilter && jobIdFilter !== "all") params.set("jobId", jobIdFilter);

  const key = `/applications?${params.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<CVListResponse>(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
    keepPreviousData: true,
  });

  return {
    applications: data?.applications || [],
    totalPage: data?.totalPage || 1,
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Helper to invalidate cache after mutations
export function invalidateCache(pattern: string) {
  clearApiCache(pattern);
  // Also could mutate SWR cache here if needed
}
