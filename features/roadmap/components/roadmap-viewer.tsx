"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";
import { Route, Milestone, CheckCircle2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface RoadmapStep {
  title: string;
  desc: string;
  status: "completed" | "current" | "upcoming";
}

const defaultSteps: RoadmapStep[] = [
  {
    title: "Foundational Infrastructure",
    desc: "Resume narrative, portfolio proof points, and ATS profile are aligned for senior frontend roles.",
    status: "completed",
  },
  {
    title: "Full-Stack Architecture",
    desc: "Close cloud deployment and system-design gaps with weekly practice and project evidence.",
    status: "current",
  },
  {
    title: "Cloud-Native Deployment",
    desc: "Prepare job-specific cover letters, targeted applications, and recruiter-ready interview stories.",
    status: "upcoming",
  },
  {
    title: "Principal Leadership",
    desc: "Build promotion-ready leadership narratives and strategic product architecture examples.",
    status: "upcoming",
  },
];

export function RoadmapViewer() {
  return (
    <Card className="border border-white/10 bg-white/[0.055] shadow-xl shadow-black/20">
      <CardHeader className="flex flex-col gap-3 border-b border-border/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Route className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold text-foreground">
              AI Career Roadmap
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Milestones, skill gaps, and job-search actions generated from your
              profile graph.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 p-6">
        {defaultSteps.map((step, index) => (
          <div key={step.title} className="grid gap-4 sm:grid-cols-[44px_1fr]">
            <div className="relative flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl border border-border bg-card text-foreground">
                {step.status === "completed" ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Milestone className="w-6 h-6" />
                )}
              </div>
              {index < defaultSteps.length - 1 && (
                <div className="absolute top-full mt-2 h-full w-px bg-border" />
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3
                  className={cn(
                    "text-lg font-semibold",
                    step.status === "upcoming"
                      ? "text-muted-foreground"
                      : "text-foreground",
                  )}
                >
                  {step.title}
                </h3>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]",
                    step.status === "completed"
                      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/10"
                      : step.status === "current"
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-white/5 text-muted-foreground border border-border",
                  )}
                >
                  {step.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
