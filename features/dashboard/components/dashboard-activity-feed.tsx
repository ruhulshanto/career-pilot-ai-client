"use client";

import { useState } from "react";
import {
  Activity,
  BrainCircuit,
  FileText,
  Map,
  MessageSquareText,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";
import type { DashboardActivity } from "../types/dashboard";
import { formatRelativeTime } from "../utils/dashboard-format";

type Props = {
  activity: DashboardActivity[];
};

export function DashboardActivityFeed({ activity }: Props) {
  const [expanded, setExpanded] = useState(false);
  const visibleActivity = expanded ? activity : activity.slice(0, 4);
  const hiddenCount = Math.max(0, activity.length - visibleActivity.length);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border/70 px-6 py-5">
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {activity.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Activity appears here as you upload resumes, complete interviews,
            generate roadmaps, and receive AI feedback.
          </p>
        ) : (
          <div className="space-y-4">
            {visibleActivity.map((item) => {
              const Icon = getActivityIcon(item.source);

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/25 p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
                        getActivityColor(item.source),
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-left sm:text-right">
                    {typeof item.score === "number" && (
                      <p className="mb-1 text-sm font-semibold text-primary">
                        {Math.round(item.score)}/100
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(item.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
            {activity.length > 4 && (
              <Button
                variant="outline"
                className="h-11 w-full"
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded
                  ? "Show Less"
                  : `View Older Activity (${hiddenCount})`}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const getActivityIcon = (source: DashboardActivity["source"]) => {
  switch (source) {
    case "resume":
      return FileText;
    case "interview":
      return MessageSquareText;
    case "roadmap":
      return Map;
    case "ai-feedback":
      return BrainCircuit;
    default:
      return Activity;
  }
};

const getActivityColor = (source: DashboardActivity["source"]) => {
  switch (source) {
    case "resume":
      return "border-primary/20 bg-primary/10 text-primary";
    case "interview":
      return "border-accent/20 bg-accent/10 text-accent-foreground";
    case "roadmap":
      return "border-accent/20 bg-accent/10 text-accent";
    case "ai-feedback":
      return "border-primary/20 bg-primary/10 text-primary";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
};
