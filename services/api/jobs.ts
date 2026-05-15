import { apiClient } from "./client";
import type { ApiResponse } from "@/shared/types/api";

export type JobMatch = {
  id: string;
  title: string;
  company: string;
  location?: string;
  jobUrl?: string;
  matchScore: number;
  skillsMatch: string[];
  missingSkills: string[];
  matchReasons: string[];
  recommendedImprovements: string[];
  source: string;
  sourceLabel: string;
  isSearchAssistant: boolean;
  applicationStatus?: string;
  createdAt: string;
};

export type CareerGoal = {
  id: string;
  title: string;
  description?: string;
  targetRole?: string;
  targetDate?: string;
  status: string;
  progress: number;
  nextSteps: string[];
  updatedAt: string;
};

export type JobApplication = {
  id: string;
  jobId?: string;
  title: string;
  company: string;
  location?: string;
  source?: string;
  sourceLabel?: string;
  jobUrl?: string;
  matchScore?: number;
  skillsMatch?: string[];
  missingSkills?: string[];
  status: string;
  notes?: string;
  appliedAt?: string;
  interviewAt?: string;
  updatedAt?: string;
};

export type UpdateApplicationPayload = {
  status: string;
  notes?: string;
  interviewAt?: string;
};

export type CreateApplicationPayload = {
  title: string;
  company: string;
  location?: string;
  source?: string;
  jobUrl?: string;
  status?: string;
  notes?: string;
  appliedAt?: string;
  interviewAt?: string;
};

export type JobFitAnalysis = {
  atsMatchPercent: number;
  matchingStrengths: string[];
  missingSkills: string[];
  recommendedImprovements: string[];
  insights: string[];
  sourceSignals: {
    resumeScore?: number;
    targetRole?: string;
    roadmapRole?: string;
    experienceLevel?: string;
    matchedSkillCount: number;
    missingSkillCount: number;
  };
};

export type UpdateGoalPayload = {
  title?: string;
  description?: string;
  targetRole?: string;
  targetDate?: string;
  nextSteps?: string[];
  status?: string;
  progress?: number;
};

export const jobsApi = {
  async getRecommendations() {
    const { data } =
      await apiClient.get<ApiResponse<JobMatch[]>>("/jobs/recommendations");
    return data.data;
  },

  async refreshRecommendations() {
    const { data } =
      await apiClient.post<ApiResponse<JobMatch[]>>("/jobs/recommendations/refresh");
    return data.data;
  },

  async saveLead(jobId: string) {
    const { data } = await apiClient.post<ApiResponse<unknown>>(`/jobs/${jobId}/save`);
    return data.data;
  },

  async apply(jobId: string) {
    return this.saveLead(jobId);
  },

  async getApplications() {
    const { data } =
      await apiClient.get<ApiResponse<JobApplication[]>>("/jobs/applications");
    return data.data;
  },

  async createApplication(payload: CreateApplicationPayload) {
    const { data } =
      await apiClient.post<ApiResponse<JobApplication>>("/jobs/applications", payload);
    return data.data;
  },

  async updateApplication(id: string, payload: UpdateApplicationPayload) {
    const { data } =
      await apiClient.patch<ApiResponse<JobApplication>>(`/jobs/applications/${id}`, payload);
    return data.data;
  },

  async analyzeJobDescription(payload: {
    jobId?: string;
    title?: string;
    company?: string;
    description: string;
  }) {
    const { data } =
      await apiClient.post<ApiResponse<JobFitAnalysis>>("/jobs/analyze-description", payload);
    return data.data;
  },

  async getGoals() {
    const { data } = await apiClient.get<ApiResponse<CareerGoal[]>>("/jobs/goals");
    return data.data;
  },

  async createGoal(payload: { title: string; targetRole?: string; nextSteps?: string[] }) {
    const { data } = await apiClient.post<ApiResponse<CareerGoal>>("/jobs/goals", payload);
    return data.data;
  },

  async updateGoal(id: string, payload: UpdateGoalPayload) {
    const { data } = await apiClient.patch<ApiResponse<CareerGoal>>(`/jobs/goals/${id}`, payload);
    return data.data;
  },
};
