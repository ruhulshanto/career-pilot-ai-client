"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  Check,
  Circle,
  Compass,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useWorkspaceBase } from "@/shared/hooks/use-workspace-base";
import {
  getWorkspaceHref,
  resolveWorkspaceHref,
} from "@/shared/lib/role-routing";
import { cn } from "@/shared/lib/utils";
import {
  onboardingApi,
  onboardingQueryKeys,
  type OnboardingProgress,
} from "../api/onboarding-api";
import { CardGridLoading } from "@/shared/components/loading/loading-system";

export function OnboardingProgressCard() {
  const queryClient = useQueryClient();
  const workspaceBase = useWorkspaceBase();
  const progressQuery = useQuery({
    queryKey: onboardingQueryKeys.progress,
    queryFn: onboardingApi.getProgress,
    staleTime: 15_000,
    refetchInterval: (query) => {
      const data = query.state.data as OnboardingProgress | undefined;
      return data?.isComplete || data?.isSkipped ? false : 15_000;
    },
    retry: 1,
  });

  const skipMutation = useMutation({
    mutationFn: onboardingApi.skip,
    onSuccess: (data) => {
      queryClient.setQueryData(onboardingQueryKeys.progress, data);
    },
  });

  const progress = progressQuery.data;

  if (progressQuery.isLoading) {
    return <CardGridLoading count={1} />;
  }

  if (!progress || progress.isComplete || progress.isSkipped) return null;

  return (
    <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <Card className="border-primary/15">
        <CardHeader className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Compass className="h-4 w-4" />
              First-time setup
            </div>
            <CardTitle className="text-2xl font-semibold">
              Continue your career journey
            </CardTitle>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Complete these steps once to connect resume insights, roadmap,
              interviews, job matches, goals, and mentoring into one guided flow.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-9"
            onClick={() => skipMutation.mutate()}
            disabled={skipMutation.isPending}
          >
            <X className="mr-2 h-4 w-4" />
            Skip
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 p-6 pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{progress.completedSteps.length} of {progress.steps.length} complete</span>
              <span>{progress.progressPercent}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${progress.progressPercent}%` }}
              />
            </div>
          </div>

          <div className="grid gap-3">
            {progress.steps.map((step, index) => {
              const isCurrent = progress.currentStep === step.id;
              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex gap-3 rounded-xl border p-4",
                    step.completed
                      ? "border-accent/20 bg-accent/5"
                      : isCurrent
                        ? "border-primary/30 bg-primary/5"
                        : "border-border/70 bg-muted/20",
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                      step.completed
                        ? "border-accent/30 bg-accent/10 text-accent"
                        : "border-border bg-background text-muted-foreground",
                    )}
                  >
                    {step.completed ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="font-semibold text-foreground">
                        {step.title}
                      </h3>
                      {isCurrent ? (
                        <span className="w-fit rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                          Current
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-6">
          <CardTitle className="flex items-center gap-2 text-base">
            <Circle className="h-4 w-4 fill-primary text-primary" />
            Next Recommended Step
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 p-6 pt-0">
          {progress.nextAction ? (
            <>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {progress.nextAction.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {progress.nextAction.description}
                </p>
              </div>
              <Button asChild className="h-11 w-full">
                <Link
                  href={resolveWorkspaceHref(
                    workspaceBase,
                    progress.nextAction.actionLink,
                  )}
                >
                  {progress.nextAction.actionLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 w-full">
                <Link href={getWorkspaceHref(workspaceBase, "chat")}>
                  Ask mentor for help
                </Link>
              </Button>
            </>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}
