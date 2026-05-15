"use client";

import { DashboardSummaryCards } from "@/features/dashboard/components/dashboard-summary-cards";
import { DashboardError } from "@/features/dashboard/components/dashboard-error";
import { DashboardSkeleton } from "@/features/dashboard/components/dashboard-skeleton";
import { useDashboardSummary } from "@/features/dashboard/hooks/use-dashboard-summary";
import type { DashboardSummary } from "@/features/dashboard/types/dashboard";

type AnalyticsCardsProps = {
  summary?: DashboardSummary;
};

export function AnalyticsCards({ summary }: AnalyticsCardsProps) {
  const query = useDashboardSummary();
  const resolvedSummary = summary ?? query.data;

  if (!resolvedSummary && query.isLoading) {
    return <DashboardSkeleton />;
  }

  if (!resolvedSummary && query.isError) {
    return (
      <DashboardError
        message={
          (query.error as { message?: string })?.message ??
          "Analytics summary could not be loaded."
        }
        onRetry={() => query.refetch()}
      />
    );
  }

  return resolvedSummary ? (
    <DashboardSummaryCards summary={resolvedSummary} />
  ) : null;
}
