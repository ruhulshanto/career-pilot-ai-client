import { apiClient } from "./client";

export type CareerContext = {
  resume: {
    latestResumeId?: string;
    title?: string;
    atsScore?: number;
    inferredTargetRole?: string;
    experienceLevel?: string;
    missingSkills: string[];
    keywordGaps: string[];
    strengths: string[];
    improvementSuggestions: string[];
  };
  roadmap: {
    latestRoadmapId?: string;
    targetRole?: string;
    currentLevel?: string;
    progress?: number;
    activeMilestone?: string;
    nextMilestone?: string;
    skillsToBuild: string[];
  };
  interview: {
    latestSessionId?: string;
    latestScore?: number;
    scheduledAt?: string;
    status?: string;
    weakestQuestions: string[];
    suggestedPracticeAreas: string[];
  };
  chatbot: {
    latestSessionId?: string;
    lastMessageAt?: string;
    actionPlan: string[];
  };
  readiness: {
    resume: number;
    roadmap: number;
    interview: number;
    overall: number;
  };
  nextAction: {
    label: string;
    href: string;
    reason: string;
  };
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const careerApi = {
  getContext: async (): Promise<CareerContext> => {
    const { data } =
      await apiClient.get<ApiResponse<CareerContext>>("/career/context");
    return data.data;
  },
};
