import { apiClient } from "@/services/api/client";
import type { ApiResponse } from "@/shared/types/api";
import type { DashboardSummary } from "../types/dashboard";

export const dashboardApi = {
  async getSummary() {
    const { data } =
      await apiClient.get<ApiResponse<DashboardSummary>>("/dashboard/summary");
    return data.data;
  },
};
