"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useWorkspaceBase } from "@/shared/hooks/use-workspace-base";
import { getWorkspaceHref } from "@/shared/lib/role-routing";
import type { DashboardSkillGap } from "../types/dashboard";

type Props = {
  gaps: DashboardSkillGap[];
};

export function DashboardSkillGaps({ gaps }: Props) {
  const workspaceBase = useWorkspaceBase();
  const visibleGaps = gaps.slice(0, 3);
  const highestGap = visibleGaps[0];

  return (
    <Card className="scroll-mt-24">
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border/70 px-6 py-5">
        <div>
          <CardTitle className="text-lg font-semibold">Skill Snapshot</CardTitle>
          <p className="text-sm text-muted-foreground">
            High-level gaps from your latest completed analysis.
          </p>
        </div>
        <BrainCircuit className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent className="space-y-5 p-6">
        {gaps.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Skill gaps appear after a completed resume analysis is available.
          </p>
        ) : (
          <>
            <div className="rounded-xl border border-primary/15 bg-primary/5 p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Priority Focus
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-foreground">
                    {highestGap?.skill ?? "No skill gaps yet"}
                  </h3>
                </div>
                <BarChart3 className="h-6 w-6 shrink-0 text-primary" />
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {highestGap
                  ? `${highestGap.gapScore}% gap detected. Open Skill Analysis for learning goals, progress, and recommended resources.`
                  : "Upload or analyze a resume to generate skill insights."}
              </p>
            </div>

            <div className="space-y-3">
              {visibleGaps.map((gap) => (
                <div
                  key={`${gap.source}:${gap.skill}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-muted/25 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {gap.skill}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {gap.source === "roadmap" ? "Roadmap signal" : "Resume signal"}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {gap.gapScore}% gap
                  </span>
                </div>
              ))}
            </div>

            <Button asChild className="w-full">
              <Link href={getWorkspaceHref(workspaceBase, "skills")}>
                Open Skill Analysis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
