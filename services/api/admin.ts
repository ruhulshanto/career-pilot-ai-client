import { apiClient } from "@/services/api/client";

export type AdminDashboard = {
  cards: {
    totalUsers: number;
    activeUsers: number;
    resumesAnalyzed: number;
    roadmapsGenerated: number;
    interviewsCompleted: number;
    chatbotMessages: number;
    jobApplications: number;
    notificationsSent: number;
  };
  aiUsage: {
    totalRequests: number;
    failedRequests: number;
    retryCountEstimate: number;
    averageResponseTimeMs: number;
    totalTokens: number;
    providerUsage: Array<{ provider: string; count: number }>;
    usageByType: Array<{ type: string; count: number; tokens: number }>;
  };
  charts: {
    trends: Array<{
      date: string;
      users: number;
      roadmaps: number;
      interviews: number;
      aiRequests: number;
    }>;
  };
  tables: {
    newestUsers: Array<{
      id: string;
      email: string;
      username: string;
      firstName: string;
      lastName: string;
      role: string;
      emailVerifiedAt?: string | null;
      createdAt: string;
    }>;
    recentFailures: Array<{
      id: string;
      type: string;
      provider: string;
      errorMessage?: string | null;
      createdAt: string;
      user?: { email: string; username: string };
    }>;
    recentAiJobs: Array<{
      id: string;
      type: string;
      provider: string;
      status: string;
      score?: number | null;
      promptTokens?: number | null;
      completionTokens?: number | null;
      createdAt: string;
    }>;
    recentNotifications: Array<{
      id: string;
      type: string;
      status: string;
      title: string;
      createdAt: string;
      user?: { email: string; username: string };
    }>;
  };
  monitoring: {
    redis: { status: "online" | "degraded" | "offline"; latencyMs?: number };
    database: {
      status: "online" | "degraded" | "offline";
      latencyMs?: number;
      schema?: { status: "online" | "degraded" | "offline"; missing: string[] };
    };
    failedJobs: number;
    stuckJobs: number;
    uptimeSeconds: number;
    systemStatus: "online" | "degraded" | "offline";
    ai: {
      status: "online" | "degraded" | "offline";
      providers: Record<string, unknown>;
    };
    storage: {
      provider: string;
      status: "online" | "degraded" | "offline";
      writable: boolean;
      publicBaseUrl?: string;
      message?: string;
    };
    environment: {
      nodeEnv: string;
      apiPrefix: string;
      clientOrigins: string[];
      storageProvider: string;
      aiProvider: string;
      productionReady: boolean;
      warnings: string[];
    };
    queueHealth: Array<{
      name: string;
      waiting: number;
      active: number;
      completed: number;
      failed: number;
      delayed: number;
      paused: number;
      retryCount: number;
      stuck: number;
      healthy: boolean;
      recentFailures?: Array<{
        id: string;
        name: string;
        attemptsMade: number;
        failedReason?: string;
        timestamp?: number;
        processedOn?: number;
        finishedOn?: number;
      }>;
    }>;
  };
  generatedAt: string;
};

export type AdminUsersResponse = {
  total: number;
  page: number;
  limit: number;
  users: Array<{
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
    role: string;
    emailVerifiedAt?: string | null;
    lastLoginAt?: string | null;
    createdAt: string;
    deletedAt?: string | null;
  }>;
};

export const adminApi = {
  async dashboard() {
    const response = await apiClient.get<{ data: AdminDashboard }>(
      "/admin/dashboard"
    );
    return response.data.data;
  },
  async system() {
    const response = await apiClient.get<{ data: unknown }>("/admin/system");
    return response.data.data;
  },
  async retryFailedJobs(queueName: string, limit = 10) {
    const response = await apiClient.post<{ data: { retried: number; errors: string[] } }>(
      `/admin/system/queues/${queueName}/retry-failed`,
      { limit }
    );
    return response.data.data;
  },
  async getUsers(params: {
    page: number;
    limit: number;
    search?: string;
    role?: string;
    status?: string;
  }) {
    const response = await apiClient.get<{ data: AdminUsersResponse }>(
      "/admin/users",
      { params }
    );
    return response.data.data;
  },
};
