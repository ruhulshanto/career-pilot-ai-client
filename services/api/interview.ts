import { apiClient } from "./client";

export type InterviewStatus =
  | "SCHEDULED"
  | "ACTIVE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type InterviewQuestion = {
  questionId: string;
  prompt: string;
  answer?: string;
};

export type InterviewFeedback = {
  id: string;
  type: "INTERVIEW_FEEDBACK";
  provider: "GROQ";
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  score?: number;
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
  questionFeedback?: Array<{
    questionId: string;
    score: number;
    whatWorked: string[];
    improve: string[];
    strongerAnswer: string;
  }>;
  createdAt: string;
};

export type InterviewSession = {
  id: string;
  userId: string;
  title: string;
  roleTarget: string;
  level?: string;
  status: InterviewStatus;
  questions: InterviewQuestion[];
  transcript?: unknown;
  score?: number;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  aiFeedbacks: InterviewFeedback[];
  performance?: {
    score?: number;
    passed?: boolean;
    grade?: "excellent" | "good" | "average" | "needs improvement";
    recommendation?: string;
  };
};

export type StartInterviewPayload = {
  title: string;
  roleTarget: string;
  level?: string;
  questionCount?: number;
  scheduledAt?: string;
};

export type InterviewSlot = {
  availabilityId?: string;
  startsAt: string;
  endsAt: string;
  label: string;
  available: boolean;
  capacity?: number;
  remainingCapacity?: number;
  roleTarget?: string;
  level?: string;
};

export type SubmitInterviewPayload = {
  answers: Array<{
    questionId: string;
    answer: string;
  }>;
  transcript?: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const interviewApi = {
  startSession: async (
    payload: StartInterviewPayload,
  ): Promise<InterviewSession> => {
    const { data } = await apiClient.post<ApiResponse<InterviewSession>>(
      "/interviews",
      payload,
    );
    return data.data;
  },

  getSlots: async (
    query: {
      date?: string;
      days?: number;
      roleTarget?: string;
      level?: string;
      timezoneOffsetMinutes?: number;
      now?: string;
    } = {},
  ) => {
    const { data } = await apiClient.get<ApiResponse<InterviewSlot[]>>(
      "/interviews/slots",
      { params: query },
    );
    return data.data;
  },

  submitAnswers: async (
    sessionId: string,
    payload: SubmitInterviewPayload,
  ): Promise<InterviewSession> => {
    const { data } = await apiClient.post<ApiResponse<InterviewSession>>(
      `/interviews/${sessionId}/answers`,
      payload,
    );
    return data.data;
  },

  getHistory: async (query: { page?: number; limit?: number } = {}) => {
    const { data } = await apiClient.get<ApiResponse<InterviewSession[]>>(
      "/interviews",
      { params: query },
    );
    return {
      data: data.data,
      pagination: data.meta,
    };
  },

  getSession: async (sessionId: string): Promise<InterviewSession> => {
    const { data } = await apiClient.get<ApiResponse<InterviewSession>>(
      `/interviews/${sessionId}`,
    );
    return data.data;
  },

  cancelScheduled: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`/interviews/${sessionId}`);
  },
};
