import { apiClient } from "@/services/api/client";

export type NotificationStatus = "UNREAD" | "READ" | "ARCHIVED";
export type NotificationType =
  | "SYSTEM"
  | "EMAIL"
  | "IN_APP"
  | "REMINDER"
  | "INTERVIEW_REMINDER"
  | "ROADMAP_REMINDER"
  | "JOB_MATCH"
  | "CAREER_GOAL"
  | "INTERVIEW_FEEDBACK";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  status: NotificationStatus;
  title: string;
  message: string;
  actionLink?: string;
  metadata?: Record<string, unknown>;
  readAt?: string;
  createdAt: string;
};

export type NotificationListParams = {
  page?: number;
  limit?: number;
  status?: NotificationStatus;
  types?: NotificationType[];
};

export type NotificationsResult = {
  items: NotificationItem[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

type NotificationListResponse = {
  success: boolean;
  message: string;
  data: NotificationItem[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext?: boolean;
    hasPrev?: boolean;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
};

export const notificationQueryKeys = {
  all: ["notifications"] as const,
  list: (params?: NotificationListParams | NotificationStatus) =>
    ["notifications", "list", params ?? "all"] as const,
  unreadCount: ["notifications", "unread-count"] as const,
};

export const notificationsApi = {
  async list(params?: NotificationListParams | NotificationStatus) {
    const normalizedParams =
      typeof params === "string" ? { status: params } : params;
    const { data } = await apiClient.get<NotificationListResponse>(
      "/notifications",
      {
        params: {
          limit: normalizedParams?.limit ?? 10,
          page: normalizedParams?.page ?? 1,
          status: normalizedParams?.status,
          types: normalizedParams?.types?.join(","),
        },
      },
    );

    return {
      items: data.data,
      pagination: data.meta
        ? {
            total: data.meta.total,
            page: data.meta.page,
            limit: data.meta.limit,
            totalPages: data.meta.totalPages,
            hasNextPage: Boolean(data.meta.hasNextPage ?? data.meta.hasNext),
            hasPreviousPage: Boolean(
              data.meta.hasPreviousPage ?? data.meta.hasPrev,
            ),
          }
        : undefined,
    };
  },

  async markAllAsRead() {
    await apiClient.patch("/notifications/read-all");
  },

  async markAsRead(id: string) {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  async unreadCount() {
    const { data } = await apiClient.get<{
      success: boolean;
      message: string;
      data: { count: number };
    }>("/notifications/unread-count");

    return data.data.count;
  },
};
