import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard-api";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  summary: ["dashboard", "summary"] as const,
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardQueryKeys.summary,
    queryFn: dashboardApi.getSummary,
    staleTime: 60_000,
    retry: 2,
  });
}
