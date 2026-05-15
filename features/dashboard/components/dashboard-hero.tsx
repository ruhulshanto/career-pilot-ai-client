"use client";

import Link from "next/link";
import { ArrowRight, BrainCircuit, Loader2, Radar, Route } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useWorkspaceBase } from "@/shared/hooks/use-workspace-base";
import { getWorkspaceHref } from "@/shared/lib/role-routing";
import type { DashboardSummary } from "../types/dashboard";

type Props = {
  name: string;
  summary: DashboardSummary;
};

export function DashboardHero({ name, summary }: Props) {
  const topGap = summary.topSkillGaps[0];
  const activeJobs = summary.processingAiJobs.length;
  const hasRoadmapProgress = summary.roadmapProgress > 0;
  const workspaceBase = useWorkspaceBase();

  return (
    <Card className="border-primary/15 bg-card">
      <CardContent className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_300px] lg:p-7">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {activeJobs > 0 ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Radar className="h-4 w-4" />
            )}
            {activeJobs > 0
              ? `${activeJobs} AI workflow${activeJobs === 1 ? "" : "s"} active`
              : "CareerAI synced"}
          </div>

          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Your career command center is ready, {name}.
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Resume intelligence, interview signals, roadmap progress, job
              matches, and notifications are now summarized from live platform
              data.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              variant="default"
              className="gap-2"
            >
              <Link href={getWorkspaceHref(workspaceBase, "roadmap")}>
                <Route className="h-4 w-4" />
                {hasRoadmapProgress
                  ? "Continue Roadmap"
                  : "Generate Career Roadmap"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={getWorkspaceHref(workspaceBase, "resume")}>
                Analyze Resume
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href={getWorkspaceHref(workspaceBase, "chat")}>
                Ask CareerAI
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-muted/25 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Career Readiness
              </p>
              <p className="text-xs text-muted-foreground">
                Live weighted platform score
              </p>
            </div>
            <BrainCircuit className="h-5 w-5 text-primary" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-semibold text-foreground">
              {summary.careerReadiness}
            </span>
            <span className="pb-2 text-sm text-muted-foreground">/100</span>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${summary.careerReadiness}%` }}
            />
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-border/70 bg-background/40 px-4 py-3 text-sm text-muted-foreground">
            <Radar className="h-4 w-4 shrink-0 text-primary" />
            {topGap
              ? `Next action: improve ${topGap.skill}.`
              : "Next action appears after resume, interview, or roadmap data is available."}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
