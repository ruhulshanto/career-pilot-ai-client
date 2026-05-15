"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Target,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useWorkspaceBase } from "@/shared/hooks/use-workspace-base";
import { getWorkspaceHref } from "@/shared/lib/role-routing";
import { cn } from "@/shared/lib/utils";
import type { DashboardSkillGap } from "../types/dashboard";

type Props = {
  gaps: DashboardSkillGap[];
};

type SkillPlan = DashboardSkillGap & {
  proficiency: number;
  priority: "High" | "Medium" | "Low";
  action: string;
  learningGoal: string;
  resources: string[];
};

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

const getPriority = (gapScore: number): SkillPlan["priority"] => {
  if (gapScore >= 70) return "High";
  if (gapScore >= 40) return "Medium";
  return "Low";
};

const getAction = (gap: DashboardSkillGap) => {
  if (gap.recommendation) return gap.recommendation;

  return `Build one focused proof point for ${gap.skill}: a project, case study, or interview story that shows practical use.`;
};

const getLearningGoal = (gap: DashboardSkillGap) => {
  if (gap.currentLevel && gap.targetLevel) {
    return `Move from ${gap.currentLevel} to ${gap.targetLevel} with weekly practice and a measurable portfolio outcome.`;
  }

  return `Raise confidence in ${gap.skill} by completing one small learning module and applying it to your next resume or interview example.`;
};

const getResources = (skill: string) => [
  `Find one current job post that mentions ${skill} and copy the expected outcomes.`,
  `Complete a short tutorial or documentation walkthrough focused on ${skill}.`,
  `Create one resume bullet or STAR answer that proves ${skill} in context.`,
];

const buildSkillPlans = (gaps: DashboardSkillGap[]): SkillPlan[] =>
  gaps.map((gap) => ({
    ...gap,
    proficiency: clampPercent(100 - gap.gapScore),
    priority: getPriority(gap.gapScore),
    action: getAction(gap),
    learningGoal: getLearningGoal(gap),
    resources: getResources(gap.skill),
  }));

const priorityClasses: Record<SkillPlan["priority"], string> = {
  High: "border-destructive/25 bg-destructive/10 text-destructive",
  Medium: "border-primary/25 bg-primary/10 text-primary",
  Low: "border-accent/25 bg-accent/10 text-accent",
};

export function SkillAnalysisDetail({ gaps }: Props) {
  const workspaceBase = useWorkspaceBase();
  const plans = buildSkillPlans(gaps);
  const highestPriority = plans[0];
  const averageProficiency = plans.length
    ? Math.round(
        plans.reduce((total, plan) => total + plan.proficiency, 0) /
          plans.length,
      )
    : 0;
  const highPriorityCount = plans.filter((plan) => plan.priority === "High").length;

  return (
    <div className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="border-primary/15">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <BrainCircuit className="h-4 w-4" />
              Detailed skill development plan
            </div>
            <div className="max-w-3xl space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Turn skill gaps into weekly learning goals.
              </h2>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                This page expands your dashboard snapshot into specific skill
                gaps, proficiency progress, suggested actions, and resources
                you can use for resume updates, interview stories, and roadmap
                work.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={getWorkspaceHref(workspaceBase, "roadmap")}>
                  Generate AI Roadmap
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={getWorkspaceHref(workspaceBase, "resume")}>
                  Analyze New Resume
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
          <SkillMetric
            label="Average Proficiency"
            value={`${averageProficiency}%`}
            detail="Estimated from current skill gaps"
            icon={Target}
          />
          <SkillMetric
            label="Priority Skills"
            value={highPriorityCount.toString()}
            detail="Need focused attention first"
            icon={ClipboardList}
          />
          <SkillMetric
            label="Top Focus"
            value={highestPriority?.skill ?? "Pending"}
            detail="Generated after resume analysis"
            icon={GraduationCap}
          />
        </div>
      </section>

      {plans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <BookOpenCheck className="h-10 w-10 text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Skill analysis is waiting for resume data
              </h3>
              <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                Upload or analyze a resume first. CareerAI will extract gaps and
                turn them into this detailed improvement plan.
              </p>
            </div>
            <Button asChild>
              <Link href={getWorkspaceHref(workspaceBase, "resume")}>
                Analyze Resume
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Skill Gap Breakdown
              </h3>
              <p className="text-sm text-muted-foreground">
                Each item includes a proficiency estimate, learning goal, and
                practical resources.
              </p>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {plans.map((plan) => (
              <Card
                key={`${plan.source}:${plan.skill}`}
                className="border-border/80"
              >
                <CardHeader className="gap-4 border-b border-border/70 px-5 py-5 sm:px-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <CardTitle className="text-lg font-semibold">
                        {plan.skill}
                      </CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {plan.source === "roadmap"
                          ? "Roadmap-driven signal"
                          : "Resume analysis signal"}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "w-fit rounded-full border px-3 py-1 text-xs font-semibold",
                        priorityClasses[plan.priority],
                      )}
                    >
                      {plan.priority} priority
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 p-5 sm:p-6">
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-foreground">
                        Proficiency
                      </span>
                      <span className="text-muted-foreground">
                        {plan.proficiency}% ready, {plan.gapScore}% gap
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${plan.proficiency}%` }}
                      />
                    </div>
                  </div>

                  <InsightBlock
                    title="Learning Goal"
                    icon={Target}
                    content={plan.learningGoal}
                  />

                  <InsightBlock
                    title="Suggested Action"
                    icon={CheckCircle2}
                    content={plan.action}
                  />

                  <div className="rounded-xl border border-border/70 bg-muted/25 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <BookOpenCheck className="h-4 w-4 text-primary" />
                      Improvement Resources
                    </div>
                    <div className="space-y-3">
                      {plan.resources.map((resource) => (
                        <div
                          key={resource}
                          className="flex gap-3 text-sm leading-6 text-muted-foreground"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{resource}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SkillMetric({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Target;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-2 line-clamp-2 text-2xl font-semibold text-foreground">
          {value}
        </p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

function InsightBlock({
  title,
  content,
  icon: Icon,
}: {
  title: string;
  content: string;
  icon: typeof Target;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/25 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </div>
      <p className="text-sm leading-6 text-muted-foreground">{content}</p>
    </div>
  );
}
