import { apiClient } from "@/services/api/client";

export type MentorUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  targetRole?: string;
  currentPosition?: string;
  currentCompany?: string;
  location?: string;
  mentorSpecialties?: string[];
  mentorExpertise?: string[];
  mentorRating?: number;
  mentorCompletedReviews?: number;
};

export type MentorAssignment = {
  id: string;
  mentorId: string;
  userId: string;
  status: string;
  assignedAt: string;
  mentor?: MentorUser;
  user?: MentorUser;
};

export type MentorComment = {
  id: string;
  reviewId: string;
  authorId: string;
  body: string;
  visibility: string;
  createdAt: string;
  author?: MentorUser;
};

export type MentorReview = {
  id: string;
  userId: string;
  mentorId?: string;
  type: "ROADMAP" | "RESUME" | "INTERVIEW" | "MILESTONE" | "GENERAL";
  status:
    | "PENDING"
    | "IN_REVIEW"
    | "APPROVED"
    | "CHANGES_REQUESTED"
    | "COMPLETED"
    | "REJECTED";
  title: string;
  message?: string;
  entityType?: string;
  entityId?: string;
  score?: number;
  verdict?: string;
  suggestedEdits?: unknown;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  user?: MentorUser;
  mentor?: MentorUser;
  comments?: MentorComment[];
};

export type MentorSession = {
  id: string;
  userId: string;
  mentorId?: string;
  reviewId?: string;
  status: "REQUESTED" | "APPROVED" | "REJECTED" | "CANCELLED" | "COMPLETED";
  topic: string;
  message?: string;
  scheduledAt?: string;
  durationMinutes: number;
  createdAt: string;
  updatedAt: string;
  user?: MentorUser;
  mentor?: MentorUser;
};

export type MentorDashboard = {
  stats: {
    assignedUsers: number;
    pendingReviews: number;
    upcomingSessions: number;
    completedReviews: number;
  };
  assignedUsers: MentorAssignment[];
  pendingReviews: MentorReview[];
  upcomingSessions: MentorSession[];
  roadmapReviewQueue: MentorReview[];
  resumeReviewQueue: MentorReview[];
  activityFeed: Array<{
    id: string;
    type: "REVIEW" | "SESSION";
    title: string;
    status: string;
    user?: MentorUser;
    createdAt: string;
  }>;
};

const unwrap = <T>(response: { data: { data: T } }) => response.data.data;

export const mentorApi = {
  async getMyMentor() {
    return unwrap<{
      assignment: MentorAssignment | null;
      mentor: MentorUser | null;
      sessions: MentorSession[];
    }>(await apiClient.get("/mentor/me"));
  },

  async getDashboard() {
    return unwrap<MentorDashboard>(await apiClient.get("/mentor/dashboard"));
  },

  async listReviews() {
    return unwrap<MentorReview[]>(await apiClient.get("/mentor/reviews"));
  },

  async requestReview(payload: {
    type: MentorReview["type"];
    title: string;
    message?: string;
    entityType?: string;
    entityId?: string;
  }) {
    return unwrap<MentorReview>(await apiClient.post("/mentor/reviews", payload));
  },

  async updateReview(
    id: string,
    payload: {
      status?: MentorReview["status"];
      score?: number;
      verdict?: string;
      suggestedEdits?: unknown;
    },
  ) {
    return unwrap<MentorReview>(
      await apiClient.patch(`/mentor/reviews/${id}`, payload),
    );
  },

  async addComment(id: string, payload: { body: string; parentId?: string }) {
    return unwrap<MentorComment>(
      await apiClient.post(`/mentor/reviews/${id}/comments`, payload),
    );
  },

  async requestSession(payload: {
    topic: string;
    message?: string;
    scheduledAt?: string;
    durationMinutes?: number;
    reviewId?: string;
  }) {
    return unwrap<MentorSession>(await apiClient.post("/mentor/sessions", payload));
  },

  async updateSession(id: string, payload: { status: MentorSession["status"]; scheduledAt?: string }) {
    return unwrap<MentorSession>(
      await apiClient.patch(`/mentor/sessions/${id}`, payload),
    );
  },
};
