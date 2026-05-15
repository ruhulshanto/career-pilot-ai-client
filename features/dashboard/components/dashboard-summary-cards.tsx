"use client";

import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";
import {
  Bot,
  BriefcaseBusiness,
  Gauge,
  Map as MapIcon,
  Minus,
  MessageSquareText,
  Radar,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { DashboardSummary, DashboardTrend } from "../types/dashboard";
import { formatPercent, formatScore } from "../utils/dashboard-format";

type Props = {
  summary: DashboardSummary;
};

export function DashboardSummaryCards({ summary }: Props) {
  const trendsByKey = new Map(summary.trends.map((trend) => [trend.key, trend]));
  const cards = [
    {
      label: "Career Readiness",
      value: formatScore(summary.careerReadiness),
      detail: "Weighted from resume, roadmap, interview, and job signals",
      progress: summary.careerReadiness,
      icon: Radar,
      color: "primary",
    },
    {
      label: "Resume Score",
      value: formatScore(summary.resumeScore),
      detail: `${summary.metrics.resumesAnalyzed} analyzed of ${summary.metrics.totalResumes} uploaded`,
      progress: summary.resumeScore,
      icon: Gauge,
      color: "accent",
      trend: trendsByKey.get("resumeScore"),
    },
    {
      label: "Roadmap Progress",
      value: formatPercent(summary.roadmapProgress),
      detail:
        summary.metrics.totalRoadmapMilestones > 0
          ? `${summary.metrics.completedRoadmapMilestones}/${summary.metrics.totalRoadmapMilestones} milestones complete`
          : "No active roadmap milestones yet",
      progress: summary.roadmapProgress,
      icon: MapIcon,
      color: "primary",
    },
    {
      label: "Applications Tracked",
      value: summary.metrics.applicationsTracked.toLocaleString(),
      detail: `${summary.jobMatches.toLocaleString()} active job match${summary.jobMatches === 1 ? "" : "es"}`,
      progress: Math.min(summary.metrics.applicationsTracked * 10, 100),
      icon: BriefcaseBusiness,
      color: "accent",
      trend: trendsByKey.get("applications"),
    },
    {
      label: "Interview Practice",
      value: summary.metrics.interviewPracticeCount.toLocaleString(),
      detail: `Average score ${formatPercent(summary.interviewAverage)}`,
      progress: Math.min(summary.metrics.interviewPracticeCount * 20, 100),
      icon: MessageSquareText,
      color: "primary",
      trend: trendsByKey.get("interviews"),
    },
    {
      label: "AI Usage",
      value: summary.metrics.aiUsageCount.toLocaleString(),
      detail: `${summary.metrics.activeCareerGoals.toLocaleString()} active career goal${summary.metrics.activeCareerGoals === 1 ? "" : "s"}`,
      progress: Math.min(summary.metrics.aiUsageCount * 5, 100),
      icon: Bot,
      color: "accent",
      trend: trendsByKey.get("aiUsage"),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <Card
          key={card.label}
          className="h-full transition hover:border-primary/25"
        >
          <CardContent className="flex h-full flex-col justify-between p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div
                className={cn(
                  "inline-flex items-center justify-center rounded-lg border p-2.5",
                  getColorClasses(card.color),
                )}
              >
                <card.icon className="h-5 w-5" />
              </div>
              <span className="max-w-[10rem] text-right text-xs font-medium leading-5 text-muted-foreground">
                {card.detail}
              </span>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                {card.label}
              </p>
              <div className="flex items-end justify-between gap-3">
                <h3 className="text-2xl font-semibold text-foreground">
                  {card.value}
                </h3>
                {card.trend ? <TrendBadge trend={card.trend} /> : null}
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full", getBarColor(card.color))}
                  style={{ width: `${Math.max(0, Math.min(card.progress, 100))}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TrendBadge({ trend }: { trend: DashboardTrend }) {
  const TrendIcon =
    trend.direction === "up"
      ? TrendingUp
      : trend.direction === "down"
        ? TrendingDown
        : Minus;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
        trend.direction === "up" &&
          "border-accent/20 bg-accent/10 text-accent",
        trend.direction === "down" &&
          "border-destructive/20 bg-destructive/10 text-destructive",
        trend.direction === "flat" &&
          "border-border bg-muted/60 text-muted-foreground",
      )}
    >
      <TrendIcon className="h-3.5 w-3.5" />
      {formatTrendDelta(trend)}
    </span>
  );
}

const formatTrendDelta = (trend: DashboardTrend) => {
  if (trend.direction === "flat") return "No change";
  const sign = trend.direction === "up" ? "+" : "";

  if (trend.unit === "score") {
    return `${sign}${trend.current - trend.previous} pts`;
  }

  return `${sign}${trend.changePercent}%`;
};

const getColorClasses = (color: string) => {
  switch (color) {
    case "primary":
      return "border-primary/20 bg-primary/10 text-primary";
    default:
      return "border-accent/20 bg-accent/10 text-accent";
  }
};

const getBarColor = (color: string) => {
  switch (color) {
    case "primary":
      return "bg-primary";
    default:
      return "bg-accent";
  }
};
