"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Info,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";
import type { DashboardInsight, DashboardTrend } from "../types/dashboard";

type Props = {
  insights: DashboardInsight[];
  trends: DashboardTrend[];
};

export function DashboardInsightsPanel({ insights, trends }: Props) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Live Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.length > 0 ? (
            insights.map((insight) => (
              <div
                key={insight.id}
                className="rounded-xl border border-border/70 bg-muted/25 p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                      severityClasses[insight.severity],
                    )}
                  >
                    <SeverityIcon severity={insight.severity} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      {insight.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {insight.description}
                    </p>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="mt-3 h-9 px-0 text-primary hover:bg-transparent hover:text-primary"
                    >
                      <Link href={insight.actionLink}>
                        {insight.actionLabel}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/25 p-6 text-center">
              <Info className="mx-auto mb-3 h-8 w-8 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                No insights yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Upload a resume, complete an interview practice, or generate a
                roadmap to unlock data-backed recommendations.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Weekly Movement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trends.slice(0, 5).map((trend) => (
            <div key={trend.key} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {trend.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Previous: {formatTrendValue(trend.previous, trend.unit)}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  {formatTrendValue(trend.current, trend.unit)}
                  <TrendIcon direction={trend.direction} />
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full",
                    trend.direction === "down"
                      ? "bg-destructive"
                      : trend.direction === "up"
                        ? "bg-accent"
                        : "bg-primary",
                  )}
                  style={{ width: `${trendWidth(trend)}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

const severityClasses = {
  info: "border-primary/20 bg-primary/10 text-primary",
  success: "border-accent/20 bg-accent/10 text-accent",
  warning: "border-primary/20 bg-primary/10 text-primary",
};

function SeverityIcon({ severity }: { severity: DashboardInsight["severity"] }) {
  if (severity === "success") return <CheckCircle2 className="h-4 w-4" />;
  if (severity === "warning") return <AlertTriangle className="h-4 w-4" />;
  return <Info className="h-4 w-4" />;
}

function TrendIcon({ direction }: { direction: DashboardTrend["direction"] }) {
  const className = "h-4 w-4";
  if (direction === "up") return <TrendingUp className={cn(className, "text-accent")} />;
  if (direction === "down") return <TrendingDown className={cn(className, "text-destructive")} />;
  return <Minus className={cn(className, "text-muted-foreground")} />;
}

const formatTrendValue = (value: number, unit: DashboardTrend["unit"]) => {
  if (unit === "score") return `${value}/100`;
  if (unit === "percent") return `${value}%`;
  return value.toLocaleString();
};

const trendWidth = (trend: DashboardTrend) => {
  const max = Math.max(trend.current, trend.previous, 1);
  return Math.max(6, Math.min(100, Math.round((trend.current / max) * 100)));
};
