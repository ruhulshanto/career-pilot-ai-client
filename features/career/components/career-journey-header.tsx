"use client";

import Link from "next/link";
import { CheckCircle2, Circle, FileText, MessageSquare, Route, Bot } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { CareerContext } from "@/services/api/career";
import { useWorkspaceBase } from "@/shared/hooks/use-workspace-base";
import { getWorkspaceHref } from "@/shared/lib/role-routing";

const steps = [
  {
    label: "Resume Review",
    path: "resume",
    icon: FileText,
    isComplete: (context?: CareerContext) => Boolean(context?.resume.latestResumeId),
  },
  {
    label: "Roadmap",
    path: "roadmap",
    icon: Route,
    isComplete: (context?: CareerContext) => Boolean(context?.roadmap.latestRoadmapId),
  },
  {
    label: "Interview Practice",
    path: "interview",
    icon: MessageSquare,
    isComplete: (context?: CareerContext) => Boolean(context?.interview.latestSessionId),
  },
  {
    label: "Career Mentor",
    path: "chat",
    icon: Bot,
    isComplete: (context?: CareerContext) => Boolean(context?.chatbot.latestSessionId),
  },
];

export function CareerJourneyHeader({
  context,
}: {
  context?: CareerContext;
}) {
  const workspaceBase = useWorkspaceBase();

  return (
    <div className="mb-8 rounded-xl border border-border/80 bg-card p-3 shadow-sm">
      <div className="grid gap-2 md:grid-cols-4">
        {steps.map((step, index) => {
          const complete = step.isComplete(context);
          const Icon = step.icon;
          const href = getWorkspaceHref(workspaceBase, step.path);
          return (
            <Link
              key={step.path}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                complete && "bg-primary/10 text-primary",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/25",
                  complete && "border-primary/20 bg-primary/15",
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground">
                  {step.label}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  {complete ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  ) : (
                    <Circle className="h-3.5 w-3.5" />
                  )}
                  Step {index + 1}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
