"use client";

import { DashboardHero } from "@/features/dashboard/components/dashboard-hero";
import type { DashboardSummary } from "@/features/dashboard/types/dashboard";

type WelcomeBannerProps = {
  name: string;
  summary: DashboardSummary;
};

export function WelcomeBanner({ name, summary }: WelcomeBannerProps) {
  return <DashboardHero name={name} summary={summary} />;
}
