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
    isActive: boolean;
    lastLoginAt?: string | null;
    createdAt: string;
    deletedAt?: string | null;
  }>;
};

export type AdminUserDetail = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  role: string;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  currentCompany?: string | null;
  currentPosition?: string | null;
  emailVerifiedAt?: string | null;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  _count: {
    resumes: number;
    careerRoadmaps: number;
    interviewSessions: number;
    chatbotSessions: number;
  };
  aiUsage: {
    totalRequests: number;
    totalTokens: number;
  };
};

export type AdminUserActivity = {
  events: Array<{
    id: string;
    eventType: string;
    eventName: string;
    metadata?: Record<string, any> | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt: string;
  }>;
  sessions: Array<{
    id: string;
    userAgent?: string | null;
    ipAddress?: string | null;
    lastSeenAt: string;
    createdAt: string;
    revokedAt?: string | null;
  }>;
};

export type SystemHealthData = {
  status: "online" | "degraded" | "offline";
  readiness: "healthy" | "degraded" | "unhealthy";
  requiredServices: string[];
  uptimeSeconds: number;
  startedAt: string;
  timestamp: string;
  components: {
    database: {
      status: "online" | "degraded" | "offline";
      latencyMs: number;
      schema?: { status: "online" | "degraded" | "offline"; missing: string[] };
    };
    redis: {
      status: "online" | "degraded" | "offline";
      latencyMs: number;
      message?: string;
    };
    queues: {
      status: "online" | "degraded" | "offline";
      failedJobs: number;
      stuckJobs: number;
      queueHealth: Array<{
        name: string;
        status: "online" | "degraded" | "offline";
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
          timestamp: number;
          processedOn?: number;
          finishedOn?: number;
        }>;
        message?: string;
      }>;
    };
    ai: {
      status: "online" | "degraded" | "offline";
      providers: Record<string, any>;
    };
    storage: {
      provider: string;
      status: "online" | "degraded" | "offline";
      writable: boolean;
      publicBaseUrl?: string;
      message?: string;
    };
    email: {
      provider: string;
      status: "online" | "degraded" | "offline";
      configured: boolean;
      fromConfigured: boolean;
      host?: string;
      port?: number;
      secure?: boolean;
      userConfigured: boolean;
      passwordConfigured: boolean;
      passwordLooksPlaceholder: boolean;
      message?: string;
    };
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
};

export const adminApi = {
  async dashboard() {
    const response = await apiClient.get<{ data: AdminDashboard }>(
      "/admin/dashboard"
    );
    return response.data.data;
  },
  async system() {
    const response = await apiClient.get<{ data: SystemHealthData }>("/admin/system");
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
  async getUserDetail(id: string) {
    const response = await apiClient.get<{ data: AdminUserDetail }>(
      `/admin/users/${id}`
    );
    return response.data.data;
  },
  async getUserActivity(id: string) {
    const response = await apiClient.get<{ data: AdminUserActivity }>(
      `/admin/users/${id}/activity`
    );
    return response.data.data;
  },
  async updateUserStatus(id: string, isActive: boolean) {
    const response = await apiClient.patch<{ data: { id: string; email: string; isActive: boolean } }>(
      `/admin/users/${id}/suspend`,
      { isActive }
    );
    return response.data.data;
  },
};
