import { apiClient } from "@/services/api/client";
import type { ApiResponse } from "@/shared/types/api";

export type OnboardingStepId =
  | "UPLOAD_RESUME"
  | "GENERATE_ROADMAP"
  | "TAKE_INTERVIEW"
  | "VIEW_JOB_MATCHES"
  | "CREATE_CAREER_GOAL";

export type OnboardingStep = {
  id: OnboardingStepId;
  title: string;
  description: string;
  actionLabel: string;
  actionLink: string;
  completed: boolean;
};

export type OnboardingProgress = {
  isComplete: boolean;
  isSkipped: boolean;
  currentStep?: OnboardingStepId;
  completedSteps: OnboardingStepId[];
  nextAction?: OnboardingStep;
  steps: OnboardingStep[];
  progressPercent: number;
  completedAt?: string;
  skippedAt?: string;
};

export const onboardingQueryKeys = {
  all: ["onboarding"] as const,
  progress: ["onboarding", "progress"] as const,
};

export const onboardingApi = {
  async getProgress() {
    const { data } =
      await apiClient.get<ApiResponse<OnboardingProgress>>(
        "/onboarding/progress",
      );
    return data.data;
  },

  async completeStep(step: OnboardingStepId) {
    const { data } = await apiClient.post<ApiResponse<OnboardingProgress>>(
      "/onboarding/complete-step",
      { step },
    );
    return data.data;
  },

  async skip() {
    const { data } =
      await apiClient.post<ApiResponse<OnboardingProgress>>(
        "/onboarding/skip",
      );
    return data.data;
  },
};
