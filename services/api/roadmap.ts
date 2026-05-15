import { apiClient } from "./client";

export type RoadmapStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
export type MilestoneStatus = "pending" | "in-progress" | "completed";
export type SkillStatus =
  | "not-started"
  | "learning"
  | "practicing"
  | "proficient";

export type RoadmapMilestone = {
  id: string;
  title: string;
  description: string;
  durationWeeks: number;
  requiredSkills: string[];
  recommendedResources: string[];
  projectSuggestions: string[];
  successCriteria: string[];
  progress: number;
  status: MilestoneStatus;
};

export type RoadmapSkill = {
  name: string;
  category: string;
  currentLevel: string;
  targetLevel: string;
  priority: "low" | "medium" | "high" | "critical";
  progress: number;
  status: SkillStatus;
};

export type RoadmapProject = {
  title: string;
  description: string;
  difficulty: string;
  estimatedWeeks: number;
  technologies: string[];
  skillsDemonstrated: string[];
  portfolioValue: string;
};

export type CareerRoadmap = {
  id: string;
  userId: string;
  title?: string;
  targetRole: string;
  currentLevel: string;
  preferredPath?: string;
  estimatedDurationMonths?: number;
  summary?: string;
  progress: number;
  version: number;
  status: RoadmapStatus;
  milestones: RoadmapMilestone[];
  skills: RoadmapSkill[];
  projects: RoadmapProject[];
  certifications: string[];
  learningRecommendations: string[];
  timeline: {
    phases: Array<{
      title: string;
      durationMonths: number;
      milestones: string[];
    }>;
    recommendations: string[];
  };
  failureReason?: string;
  retryAfterMs?: number;
  retryAvailableAt?: string;
  retryAttempt?: number;
  retryLimit?: number;
  retryLimitReached?: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};

export type CreateRoadmapPayload = {
  targetRole: string;
  currentLevel: string;
  preferredPath: string;
  careerGoals: string;
  industry?: string;
  sourceResumeId?: string;
  regenerateFromId?: string;
};

export type UpdateRoadmapProgressPayload = {
  milestones?: Array<{
    id: string;
    progress?: number;
    status?: MilestoneStatus;
  }>;
  skills?: Array<{
    name: string;
    progress?: number;
    status?: SkillStatus;
  }>;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const roadmapApi = {
  generate: async (payload: CreateRoadmapPayload): Promise<CareerRoadmap> => {
    const { data } = await apiClient.post<ApiResponse<CareerRoadmap>>(
      "/roadmap",
      payload,
    );
    return data.data;
  },

  getLatest: async (): Promise<CareerRoadmap | null> => {
    const { data } =
      await apiClient.get<ApiResponse<CareerRoadmap | null>>("/roadmap/latest");
    return data.data;
  },

  getById: async (id: string): Promise<CareerRoadmap> => {
    const { data } = await apiClient.get<ApiResponse<CareerRoadmap>>(
      `/roadmap/${id}`,
    );
    return data.data;
  },

  updateProgress: async (
    id: string,
    payload: UpdateRoadmapProgressPayload,
  ): Promise<CareerRoadmap> => {
    const { data } = await apiClient.patch<ApiResponse<CareerRoadmap>>(
      `/roadmap/${id}/progress`,
      payload,
    );
    return data.data;
  },
};
