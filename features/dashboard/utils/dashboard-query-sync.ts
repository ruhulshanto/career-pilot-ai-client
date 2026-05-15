import type { QueryClient } from "@tanstack/react-query";
import { notificationQueryKeys } from "@/features/notifications/api/notifications-api";
import { dashboardQueryKeys } from "../hooks/use-dashboard-summary";

export const refreshDashboardQueries = async (queryClient: QueryClient) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all }),
    queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all }),
  ]);

  await Promise.all([
    queryClient.refetchQueries({
      queryKey: dashboardQueryKeys.all,
      type: "active",
    }),
    queryClient.refetchQueries({
      queryKey: notificationQueryKeys.all,
      type: "active",
    }),
  ]);
};

export const scheduleDashboardRefresh = (
  queryClient: QueryClient,
  delayMs = 900,
) => {
  window.setTimeout(() => {
    void refreshDashboardQueries(queryClient);
  }, delayMs);
};
