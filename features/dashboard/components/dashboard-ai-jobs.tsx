"use client";

import { Clock, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import type { DashboardAiJob } from "../types/dashboard";
import {
  formatRelativeTime,
  readableType,
} from "../utils/dashboard-format";

type Props = {
  jobs: DashboardAiJob[];
};

export function DashboardAiJobs({ jobs }: Props) {
  return (
    <Card className="border-primary/15">
      <CardHeader className="border-b border-border/70 px-6 py-5">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <Loader2 className="h-5 w-5 text-primary" />
          AI Processing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No AI workflows are currently queued or processing.
          </p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-xl border border-border/70 bg-muted/25 p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">
                    {readableType(job.type)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {job.progressStage}
                  </p>
                </div>
                <span className="rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {readableType(job.status)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width:
                      typeof job.progress === "number"
                        ? `${Math.max(5, Math.min(job.progress, 100))}%`
                        : "100%",
                    opacity: typeof job.progress === "number" ? 1 : 0.45,
                  }}
                />
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {formatRelativeTime(job.updatedAt ?? job.createdAt)}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
