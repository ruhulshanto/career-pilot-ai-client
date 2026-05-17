"use client";

import Link from "next/link";
import { ArrowRight, Bot, FileText, MessageSquare, Route } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { CareerContext } from "@/services/api/career";
import { CardGridLoading } from "@/shared/components/loading/loading-system";

const readinessItems = [
  { key: "resume", label: "Resume", icon: FileText },
  { key: "roadmap", label: "Roadmap", icon: Route },
  { key: "interview", label: "Interview", icon: MessageSquare },
] as const;

export function CareerReadinessPanel({
  context,
}: {
  context: CareerContext;
}) {
  const roadmapProgress = Math.round(context.roadmap.progress ?? 0);
  const interviewScore = Math.round(context.interview.latestScore ?? 0);
  const activeMilestone =
    context.roadmap.activeMilestone ||
    context.roadmap.nextMilestone ||
    "Generate or update your roadmap";
  const resumeDetail = context.resume.missingSkills.length
    ? `Missing skills: ${context.resume.missingSkills.slice(0, 3).join(", ")}`
    : context.resume.keywordGaps.length
      ? `Keyword gaps: ${context.resume.keywordGaps.slice(0, 3).join(", ")}`
      : context.resume.atsScore
        ? "Resume analysis is active and feeding your plan."
        : "Analyze your resume to unlock targeted gaps.";
  const interviewFocus =
    context.interview.weakestQuestions[0] ||
    context.interview.suggestedPracticeAreas[0] ||
    "Complete a mock interview for targeted feedback";

  return (
    <Card className="border-primary/15">
      <CardContent className="grid gap-5 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Career Readiness
              </p>
              <h2 className="mt-1 text-xl font-semibold text-foreground">
                {context.readiness.overall}% overall readiness
              </h2>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-muted/25 px-3 py-2 text-sm text-muted-foreground">
              <Bot className="h-4 w-4 text-primary" />
              Connected career context
            </div>
          </div>
          <div className="rounded-xl border border-border/70 bg-muted/25 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-foreground">
                Overall journey progress
              </span>
              <span className="text-sm font-semibold text-primary">
                {context.readiness.overall}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: `${Math.max(0, Math.min(context.readiness.overall, 100))}%`,
                }}
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {readinessItems.map((item) => {
              const Icon = item.icon;
              const value = context.readiness[item.key];
              const detail =
                item.key === "resume"
                  ? resumeDetail
                  : item.key === "roadmap"
                    ? activeMilestone
                    : interviewFocus;
              return (
                <div
                  key={item.key}
                  className="rounded-xl border border-border/70 bg-muted/25 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {item.label}
                    </span>
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-2xl font-semibold text-foreground">
                    {value}%
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
                    />
                  </div>
                  <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground">
                    {detail}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <ProgressInsight
              label="Roadmap progress"
              value={roadmapProgress}
              detail={activeMilestone}
            />
            <ProgressInsight
              label="Interview readiness"
              value={context.readiness.interview}
              detail={
                interviewScore
                  ? `${interviewScore}% latest score - ${interviewFocus}`
                  : interviewFocus
              }
              tone="accent"
            />
          </div>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 lg:max-w-xs">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Next best action
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-foreground">
            {context.nextAction.label}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {context.nextAction.reason}
          </p>
          <Button asChild className="mt-4 h-11 w-full">
            <Link href={context.nextAction.href}>
               Continue
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function CareerReadinessPanelSkeleton() {
  return <CardGridLoading count={3} />;
}

export function CareerReadinessPanelFallback({
  onRetry,
}: {
  onRetry?: () => void;
}) {
  return (
    <Card className="border-primary/15">
      <CardContent className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Career Readiness
          </p>
          <h2 className="mt-1 text-xl font-semibold text-foreground">
            Connect your career signals
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Analyze your resume, generate a roadmap, and complete an interview
            to populate readiness insights.
          </p>
        </div>
        {onRetry ? (
          <Button
            type="button"
            variant="outline"
            className="h-11"
            onClick={onRetry}
          >
            Refresh panel
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ProgressInsight({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: number;
  detail: string;
  tone?: "accent";
}) {
  const barClass = tone === "accent" ? "bg-accent" : "bg-primary";

  return (
    <div className="rounded-xl border border-border/70 bg-muted/25 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <span className="text-sm font-semibold text-primary">
          {Math.max(0, Math.min(Math.round(value), 100))}%
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${barClass} transition-all duration-500`}
          style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
        />
      </div>
      <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}
