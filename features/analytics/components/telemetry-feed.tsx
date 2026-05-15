"use client";

import { DashboardActivityFeed } from "@/features/dashboard/components/dashboard-activity-feed";
import type { DashboardActivity } from "@/features/dashboard/types/dashboard";

type TelemetryFeedProps = {
  activity: DashboardActivity[];
};

export function TelemetryFeed({ activity }: TelemetryFeedProps) {
  return <DashboardActivityFeed activity={activity} />;
}
