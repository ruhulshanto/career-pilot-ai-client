"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ExternalLink,
  Loader2,
  MessageSquare,
  Milestone,
  RefreshCcw,
  Route,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { useToast } from "@/shared/hooks/use-toast";
import { useWorkspaceBase } from "@/shared/hooks/use-workspace-base";
import { getWorkspaceHref } from "@/shared/lib/role-routing";
import {
  roadmapApi,
  type CareerRoadmap,
  type CreateRoadmapPayload,
  type RoadmapMilestone,
} from "@/services/api/roadmap";
import { jobsApi, type JobMatch } from "@/services/api/jobs";
import { resumeApi, type ResumeWithFeedback } from "@/services/api/resume";
import { refreshDashboardQueries } from "@/features/dashboard/utils/dashboard-query-sync";
import { resumeQueryKeys } from "@/features/resume/api/resume-query-keys";
import { roadmapQueryKeys } from "../api/roadmap-query-keys";
import { CardGridLoading, PageLoading } from "@/shared/components/loading/loading-system";

const activeStatuses = ["PENDING", "PROCESSING"] as const;
const terminalStatuses = ["COMPLETED", "FAILED"] as const;

const cleanText = (value?: string | null) => value?.trim() || "";

const inferTargetRole = (resume: ResumeWithFeedback | null) => {
  const analysis = resume?.aiFeedbacks[0]?.rawResponse;
  const explicitRole = cleanText(analysis?.inferredTargetRole);
  if (explicitRole) return explicitRole;

  const title = cleanText(resume?.title)
    .replace(/resume/gi, "")
    .replace(/cv/gi, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return title.length >= 2 ? title : "";
};

const inferExperienceLevel = (resume: ResumeWithFeedback | null) => {
  const analysis = resume?.aiFeedbacks[0]?.rawResponse;
  const explicitLevel = cleanText(analysis?.experienceLevel);
  if (explicitLevel) return explicitLevel;

  const sourceText = `${resume?.parsedText ?? ""} ${analysis?.summary ?? ""}`;
  const yearsMatch = sourceText.match(/(\d+)\+?\s*(?:years|yrs)/i);
  const years = yearsMatch ? Number(yearsMatch[1]) : null;

  if (years !== null) {
    if (years >= 10) return "Lead";
    if (years >= 6) return "Senior";
    if (years >= 3) return "Mid-Level";
    if (years >= 1) return "Junior";
  }

  return "Entry Level";
};

export function RoadmapViewer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [trackedRoadmapId, setTrackedRoadmapId] = useState<string | null>(null);
  const [lastGenerationPayload, setLastGenerationPayload] =
    useState<CreateRoadmapPayload | null>(null);
  const [processingStartedAt, setProcessingStartedAt] = useState<number | null>(
    null,
  );
  const [processingElapsedMs, setProcessingElapsedMs] = useState(0);
  const lastSyncedStatusRef = useRef<string | null>(null);

  const latestQuery = useQuery({
    queryKey: roadmapQueryKeys.latest,
    queryFn: roadmapApi.getLatest,
    staleTime: 30_000,
    retry: 2,
  });

  const resumeHistoryQuery = useQuery({
    queryKey: resumeQueryKeys.history(),
    queryFn: resumeApi.getHistory,
    staleTime: 15_000,
  });

  const latestCompletedResumeId =
    resumeHistoryQuery.data?.data.find((resume) => resume.status === "COMPLETED")
      ?.id ?? null;

  const latestResumeQuery = useQuery({
    queryKey: resumeQueryKeys.analysis(latestCompletedResumeId),
    queryFn: () => resumeApi.getById(latestCompletedResumeId!),
    enabled: Boolean(latestCompletedResumeId),
    staleTime: 30_000,
  });

  const latestRoadmap = latestQuery.data ?? null;
  const latestRoadmapIsLegacyProviderFailure = false;
  const latestRoadmapIsActive = Boolean(
    latestRoadmap && activeStatuses.includes(latestRoadmap.status as any),
  );
  const roadmapId = trackedRoadmapId;
  const roadmapQuery = useQuery({
    queryKey: roadmapQueryKeys.detail(roadmapId),
    queryFn: () => roadmapApi.getById(roadmapId!),
    enabled: Boolean(roadmapId),
    refetchInterval: (query) => {
      const roadmap = query.state.data;
      return roadmap && activeStatuses.includes(roadmap.status as any)
        ? 15000
        : false;
    },
  });

  const trackedRoadmap =
    roadmapQuery.data ??
    (trackedRoadmapId && latestRoadmap?.id === trackedRoadmapId
      ? latestRoadmap
      : null);
  const roadmap = trackedRoadmapId
    ? trackedRoadmap
    : latestRoadmapIsActive || latestRoadmapIsLegacyProviderFailure
      ? null
      : latestRoadmap;

  const generateMutation = useMutation({
    mutationFn: roadmapApi.generate,
    onSuccess: (queued) => {
      setTrackedRoadmapId(queued.id);
      setProcessingStartedAt(Date.now());
      setProcessingElapsedMs(0);
      lastSyncedStatusRef.current = queued.status;
      queryClient.setQueryData(roadmapQueryKeys.detail(queued.id), queued);
      queryClient.setQueryData(roadmapQueryKeys.latest, queued);
      void queryClient.invalidateQueries({ queryKey: roadmapQueryKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["career-context"] });
      void queryClient.invalidateQueries({ queryKey: ["jobs", "recommendations"] });
      void refreshDashboardQueries(queryClient);
      toast({
        title: "Roadmap generation queued",
        description: "CareerAI is building your personalized roadmap.",
      });
    },
    onError: (err: { message?: string }) => {
      toast({
        variant: "destructive",
        title: "Roadmap generation unavailable",
        description: getRoadmapGenerationErrorMessage(err.message),
      });
    },
  });

  const handleGenerateRoadmap = (payload: CreateRoadmapPayload) => {
    setTrackedRoadmapId(null);
    setLastGenerationPayload(payload);
    setProcessingStartedAt(null);
    setProcessingElapsedMs(0);
    lastSyncedStatusRef.current = null;
    queryClient.removeQueries({ queryKey: ["roadmap", "detail"] });
    generateMutation.mutate(payload);
  };

  const progressMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof roadmapApi.updateProgress>[1];
    }) => roadmapApi.updateProgress(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(roadmapQueryKeys.detail(updated.id), updated);
      void queryClient.invalidateQueries({ queryKey: roadmapQueryKeys.latest });
      void queryClient.invalidateQueries({ queryKey: ["career-context"] });
      void refreshDashboardQueries(queryClient);
    },
  });

  const isProcessing = Boolean(
    trackedRoadmapId &&
      roadmap &&
      activeStatuses.includes(roadmap.status as any),
  );

  useEffect(() => {
    if (!trackedRoadmapId) return;
    if (!roadmap) return;
    if (roadmap.status === lastSyncedStatusRef.current) return;

    lastSyncedStatusRef.current = roadmap.status;
    if (
      activeStatuses.includes(roadmap.status as any) ||
      terminalStatuses.includes(roadmap.status as any)
    ) {
      void queryClient.invalidateQueries({ queryKey: roadmapQueryKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["career-context"] });
      void queryClient.invalidateQueries({ queryKey: ["jobs", "recommendations"] });
      void refreshDashboardQueries(queryClient);
    }
  }, [queryClient, roadmap?.status, trackedRoadmapId]);

  useEffect(() => {
    if (!isProcessing || !processingStartedAt) return;

    const intervalId = window.setInterval(() => {
      setProcessingElapsedMs(Date.now() - processingStartedAt);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isProcessing, processingStartedAt]);

  useEffect(() => {
    if (!roadmap || activeStatuses.includes(roadmap.status as any)) return;

    setProcessingStartedAt(null);
    setProcessingElapsedMs(0);
  }, [roadmap?.status]);

  return (
    <div className="space-y-8">
      <RoadmapGenerationPanel
        latestRoadmap={roadmap}
        latestResume={latestResumeQuery.data ?? null}
        isResumeLoading={resumeHistoryQuery.isLoading || latestResumeQuery.isLoading}
        resumeError={
          resumeHistoryQuery.isError || latestResumeQuery.isError
            ? ((resumeHistoryQuery.error as { message?: string } | null)
                ?.message ||
              (latestResumeQuery.error as { message?: string } | null)
                ?.message ||
              "Unable to load your latest completed resume analysis.")
            : null
        }
        isGenerating={generateMutation.isPending}
        onGenerate={handleGenerateRoadmap}
      />

      {latestQuery.isLoading && !roadmap ? (
        <RoadmapLoading />
      ) : latestQuery.isError && !roadmap ? (
        <RoadmapError
          message={
            (latestQuery.error as { message?: string })?.message ||
            "Unable to load your career roadmap."
          }
          onRetry={() => latestQuery.refetch()}
        />
      ) : !roadmap ? (
        latestRoadmapIsLegacyProviderFailure ? (
          <RoadmapReadyState />
        ) : latestRoadmapIsActive ? (
          <RoadmapIdleActiveNotice roadmap={latestRoadmap!} />
        ) : (
          <RoadmapEmpty />
        )
      ) : isProcessing ? (
        <RoadmapProcessing
          roadmap={roadmap}
          elapsedMs={processingElapsedMs}
          isRetrying={generateMutation.isPending}
          onRetry={
            lastGenerationPayload
              ? () => handleGenerateRoadmap(lastGenerationPayload)
              : undefined
          }
        />
      ) : roadmap.status === "FAILED" ? (
        <RoadmapError
          message={
            roadmap.failureReason ||
            "Roadmap generation failed before a valid AI plan was produced."
          }
          roadmap={roadmap}
          isRetrying={generateMutation.isPending}
          onRetry={
            () =>
              handleGenerateRoadmap({
                targetRole: roadmap.targetRole,
                currentLevel: roadmap.currentLevel,
                preferredPath: roadmap.preferredPath || "AI career growth",
                careerGoals: `Build a practical career plan toward ${roadmap.targetRole}.`,
                regenerateFromId: roadmap.id,
              })
          }
        />
      ) : (
        <RoadmapTimeline
          roadmap={roadmap}
          isUpdating={progressMutation.isPending}
          onToggleMilestone={(milestone) => {
            const completed = milestone.status === "completed";
            progressMutation.mutate({
              id: roadmap.id,
              payload: {
                milestones: [
                  {
                    id: milestone.id,
                    status: completed ? "in-progress" : "completed",
                    progress: completed ? 50 : 100,
                  },
                ],
              },
            });
          }}
        />
      )}
    </div>
  );
}

function RoadmapGenerationPanel({
  latestRoadmap,
  latestResume,
  isResumeLoading,
  resumeError,
  isGenerating,
  onGenerate,
}: {
  latestRoadmap: CareerRoadmap | null;
  latestResume: ResumeWithFeedback | null;
  isResumeLoading: boolean;
  resumeError: string | null;
  isGenerating: boolean;
  onGenerate: (payload: CreateRoadmapPayload) => void;
}) {
  const [careerGoals, setCareerGoals] = useState("");
  const [industry, setIndustry] = useState("");

  const targetRole = useMemo(() => inferTargetRole(latestResume), [latestResume]);
  const currentLevel = useMemo(
    () => inferExperienceLevel(latestResume),
    [latestResume],
  );
  const feedback = latestResume?.aiFeedbacks[0];
  const isValidAnalysis =
    latestResume?.status === "COMPLETED" && feedback?.status === "COMPLETED";
  const preferredPath = targetRole
    ? `Career growth toward ${targetRole}`
    : "Personalized career growth";
  const careerGoalsValue = careerGoals.trim();
  const industryValue = industry.trim();
  const canSubmit =
    Boolean(isValidAnalysis) &&
    targetRole.length >= 2 &&
    currentLevel.length >= 2 &&
    careerGoalsValue.length >= 10;

  const formBlockerMessage = resumeError
    ? resumeError
    : isResumeLoading
      ? "Loading your latest completed resume analysis."
      : !isValidAnalysis
        ? "Complete a resume analysis first to unlock roadmap generation."
        : targetRole.length < 2 || currentLevel.length < 2
          ? "The latest analysis does not include enough role or experience data. Re-run resume analysis to refresh it."
          : null;
  const careerGoalsError =
    isValidAnalysis && targetRole.length >= 2 && currentLevel.length >= 2 && careerGoalsValue.length < 10
      ? "Career Goals is required. Add at least 10 characters so the roadmap can be personalized."
      : null;

  return (
    <Card className="border border-accent/15 bg-accent/[0.055] shadow-xl shadow-elevation/10">
      <CardHeader className="flex flex-col gap-3 border-b border-border/70 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4 sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <Route className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-xl font-semibold text-foreground sm:text-2xl">
              AI Career Roadmap
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Generated from your resume analysis, skill gaps, goals, and target
              role.
            </p>
          </div>
        </div>
        {latestRoadmap && (
          <div className="w-full rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground lg:w-auto">
            Latest: {latestRoadmap.targetRole} - {Math.round(latestRoadmap.progress)}%
          </div>
        )}
      </CardHeader>

      <CardContent className="grid gap-5 p-4 sm:p-6 md:grid-cols-2">
        <DetectedAnalysisField
          label="Target Role"
          value={targetRole || "Waiting for completed analysis"}
        />
        <DetectedAnalysisField
          label="Experience Level"
          value={currentLevel || "Waiting for completed analysis"}
        />

        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="roadmap-career-goals"
              className="text-sm font-semibold text-foreground"
            >
              Career Goals
            </label>
            <span className="text-xs font-medium text-accent">
              Required
            </span>
          </div>
          <textarea
            id="roadmap-career-goals"
            value={careerGoals}
            onChange={(event) => setCareerGoals(event.target.value)}
            placeholder="Example: Move into an AI product engineering role within 6 months and build a stronger portfolio."
            aria-invalid={Boolean(careerGoalsError)}
            aria-describedby={
              careerGoalsError ? "roadmap-career-goals-error" : undefined
            }
            className={cn(
              "min-h-24 w-full resize-y rounded-xl border bg-muted/40 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-foreground/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
              careerGoalsError
                ? "border-primary/40"
                : "border-border/60",
            )}
          />
          {careerGoalsError && (
            <p
              id="roadmap-career-goals-error"
              className="text-sm text-primary"
            >
              {careerGoalsError}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="roadmap-industry"
              className="text-sm font-semibold text-foreground"
            >
              Industry Focus
            </label>
            <span className="text-xs font-medium text-muted-foreground">
              Optional
            </span>
          </div>
          <Input
            id="roadmap-industry"
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            placeholder="Example: fintech, healthcare, SaaS"
          />
        </div>

        <div className="flex flex-col gap-3 md:items-end md:justify-end">
          <Button
            className="h-12 w-full rounded-2xl md:w-auto md:min-w-56"
            disabled={!canSubmit}
            loading={isGenerating}
            onClick={() =>
              onGenerate({
                targetRole,
                currentLevel,
                preferredPath,
                careerGoals: careerGoalsValue,
                industry: industryValue || undefined,
                sourceResumeId: latestResume?.id,
              })
            }
          >
            Generate AI Roadmap
          </Button>
          {latestRoadmap && (
            <Button
              variant="outline"
              className="h-12 w-full rounded-2xl md:w-auto md:min-w-56"
              disabled={!canSubmit}
              onClick={() =>
                onGenerate({
                  targetRole,
                  currentLevel,
                  preferredPath,
                  careerGoals: careerGoalsValue,
                  industry: industryValue || undefined,
                  sourceResumeId: latestResume?.id,
                  regenerateFromId: latestRoadmap.id,
                })
              }
            >
              <RefreshCcw className="h-4 w-4" />
              Regenerate Version
            </Button>
          )}
        </div>

        {formBlockerMessage && (
          <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary md:col-span-2">
            {formBlockerMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DetectedAnalysisField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/40 px-4 py-3">
      <p className="text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function RoadmapTimeline({
  roadmap,
  isUpdating,
  onToggleMilestone,
}: {
  roadmap: CareerRoadmap;
  isUpdating: boolean;
  onToggleMilestone: (milestone: RoadmapMilestone) => void;
}) {
  const workspaceBase = useWorkspaceBase();
  const orderedMilestones = useMemo(() => roadmap.milestones, [roadmap]);

  return (
    <div className="space-y-8">
      <Card className="border border-border/60 bg-muted/35 shadow-xl shadow-elevation/10">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[1fr_260px]">
          <div>
            <p className="text-sm font-semibold text-accent">
              {roadmap.estimatedDurationMonths ?? 0} month plan - version{" "}
              {roadmap.version}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">
              {roadmap.title || roadmap.targetRole}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {roadmap.summary}
            </p>
          </div>
          <div className="rounded-3xl border border-border/60 bg-muted/40 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                Roadmap Progress
              </span>
              <BrainCircuit className="h-5 w-5 text-accent" />
            </div>
            <div className="mt-5 text-5xl font-semibold text-foreground">
              {Math.round(roadmap.progress)}%
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted/60">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.max(0, Math.min(roadmap.progress, 100))}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-primary/30 bg-primary/10 shadow-xl shadow-elevation/5">
        <CardContent className="grid gap-5 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <span className="mb-2 inline-flex rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Recommended next step
              </span>
              <p className="text-lg font-semibold text-foreground">
                Next: Take your Interview Practice
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Use this roadmap target role to practice realistic interview
                questions and get AI feedback on each answer.
              </p>
            </div>
          </div>
          <Button asChild size="lg" className="h-14 w-full px-8 text-base sm:w-auto">
            <Link
              href={`${getWorkspaceHref(workspaceBase, "interview")}?role=${encodeURIComponent(
                roadmap.targetRole,
              )}&level=${encodeURIComponent(roadmap.currentLevel)}`}
            >
              <MessageSquare className="h-5 w-5" />
              Start Practice
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-border/60 bg-muted/35 shadow-xl shadow-elevation/10">
        <CardHeader className="border-b border-border/70 px-6 py-5">
          <CardTitle className="text-lg font-semibold">
            Personalized Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {orderedMilestones.map((milestone, index) => (
            <MilestoneCard
              key={milestone.id || `milestone-${index}`}
              milestone={milestone}
              isLast={index === orderedMilestones.length - 1}
              isUpdating={isUpdating}
              onToggle={() => onToggleMilestone(milestone)}
            />
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <InsightList title="Skills To Build" items={roadmap.skills.map((skill) => `${skill.name} - ${skill.priority} priority - ${Math.round(skill.progress)}%`)} />
        <InsightList title="Portfolio Projects" items={roadmap.projects.map((project) => `${project.title} - ${project.technologies.join(", ")}`)} />
        <InsightList title="Learning Recommendations" items={roadmap.learningRecommendations} />
        <InsightList title="Certifications" items={roadmap.certifications.length ? roadmap.certifications : ["No certifications required for this roadmap."]} />
      </div>

      <RoadmapJobRecommendations roadmap={roadmap} />
    </div>
  );
}

function RoadmapJobRecommendations({ roadmap }: { roadmap: CareerRoadmap }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const workspaceBase = useWorkspaceBase();
  const jobsQuery = useQuery<JobMatch[]>({
    queryKey: ["jobs", "recommendations", "roadmap", roadmap.id],
    queryFn: jobsApi.getRecommendations,
    enabled: roadmap.status === "COMPLETED",
    staleTime: 30_000,
  });
  const refreshMutation = useMutation({
    mutationFn: jobsApi.refreshRecommendations,
    onSuccess: (jobs) => {
      queryClient.setQueryData(["jobs", "recommendations", "roadmap", roadmap.id], jobs);
      void queryClient.invalidateQueries({ queryKey: ["jobs", "recommendations"] });
      toast({
        variant: "success",
        title: "Job matches refreshed",
        description: `Updated recommendations for ${roadmap.targetRole}.`,
      });
    },
    onError: (error: { message?: string }) => {
      toast({
        variant: "destructive",
        title: "Could not refresh jobs",
        description: error.message || "Please try again in a moment.",
      });
    },
  });

  const jobs = jobsQuery.data ?? [];

  return (
    <Card className="border border-accent/20 bg-accent/[0.055] shadow-xl shadow-elevation/10">
      <CardHeader className="flex flex-col gap-4 border-b border-border/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <BriefcaseBusiness className="h-5 w-5 text-accent" />
            Job Matches For This Roadmap
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Matched from {roadmap.targetRole}, roadmap skills, and missing skill gaps.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            variant="outline"
            className="h-10 rounded-2xl"
            onClick={() => refreshMutation.mutate()}
            disabled={refreshMutation.isPending}
          >
            {refreshMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            Refresh Jobs
          </Button>
          <Button asChild className="h-10 rounded-2xl">
            <Link href={getWorkspaceHref(workspaceBase, "jobs")}>
              View All Jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {jobsQuery.isLoading ? (
          <CardGridLoading count={3} />
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-muted/40 px-4 py-5 text-sm text-muted-foreground">
            No job matches yet. Refresh jobs after your roadmap finishes generating.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {jobs.slice(0, 3).map((job) => (
              <RoadmapJobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RoadmapJobCard({ job }: { job: JobMatch }) {
  const workspaceBase = useWorkspaceBase();

  return (
    <div className="flex min-h-full flex-col rounded-2xl border border-border/60 bg-muted/40 p-4 transition hover:border-accent/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
            {job.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {job.company}
            {job.location ? ` - ${job.location}` : ""}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
          {job.matchScore}%
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(job.skillsMatch ?? []).slice(0, 2).map((skill) => (
          <span key={skill} className="rounded-full bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
            {skill}
          </span>
        ))}
        {(job.missingSkills ?? []).slice(0, 2).map((skill) => (
          <span key={skill} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
            Gap: {skill}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-4">
        {job.jobUrl ? (
          <Button asChild variant="outline" className="h-10 w-full rounded-2xl">
            <a href={job.jobUrl} target="_blank" rel="noreferrer">
              View Job
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        ) : (
          <Button asChild variant="outline" className="h-10 w-full rounded-2xl">
            <Link href={getWorkspaceHref(workspaceBase, "jobs")}>
              Open Tracker
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

function MilestoneCard({
  milestone,
  isLast,
  isUpdating,
  onToggle,
}: {
  milestone: RoadmapMilestone;
  isLast: boolean;
  isUpdating: boolean;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(false);
  const completed = milestone.status === "completed";

  return (
    <div className="grid gap-4 sm:grid-cols-[44px_1fr]">
      <div className="relative flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl border border-border bg-card text-foreground">
          {completed ? (
            <CheckCircle2 className="h-6 w-6 text-accent" />
          ) : (
            <Milestone className="h-6 w-6 text-accent" />
          )}
        </div>
        {!isLast && <div className="absolute top-full mt-2 h-full w-px bg-border" />}
      </div>

      <div className="rounded-3xl border border-border/60 bg-muted/40 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {milestone.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {milestone.description}
            </p>
          </div>
          <Button
            variant={completed ? "outline" : "default"}
            size="sm"
            className="rounded-2xl"
            disabled={isUpdating}
            onClick={onToggle}
          >
            {completed ? "Reopen" : "Complete"}
          </Button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            {milestone.durationWeeks} weeks
          </span>
          <span
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium",
              completed
                ? "border-accent/20 bg-accent/10 text-accent"
                : "border-border/60 bg-muted/40 text-muted-foreground",
            )}
          >
            {milestone.status}
          </span>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted/60">
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${Math.max(0, Math.min(milestone.progress, 100))}%` }}
          />
        </div>

        <button
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent"
          onClick={() => setOpen((value) => !value)}
        >
          Details
          <ChevronDown
            className={cn("h-4 w-4 transition", open && "rotate-180")}
          />
        </button>

        {open && (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <MiniList title="Required Skills" items={milestone.requiredSkills} />
            <MiniList title="Resources" items={milestone.recommendedResources} />
            <MiniList title="Projects" items={milestone.projectSuggestions} />
            <MiniList title="Success Criteria" items={milestone.successCriteria} />
          </div>
        )}
      </div>
    </div>
  );
}

function InsightList({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="border border-border/60 bg-muted/35 shadow-xl shadow-elevation/10">
      <CardHeader className="border-b border-border/70 px-6 py-5">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-6">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground"
          >
            {item}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function MiniList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/35 p-4">
      <p className="mb-3 text-sm font-semibold text-foreground">{title}</p>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function RoadmapProcessing({
  roadmap,
  elapsedMs,
  isRetrying,
  onRetry,
}: {
  roadmap: CareerRoadmap;
  elapsedMs: number;
  isRetrying?: boolean;
  onRetry?: () => void;
}) {
  const isTakingLonger = elapsedMs > 120_000;
  const retryAfterMs = getRetryAfterMs(roadmap);
  const retryLimitReached = Boolean(roadmap.retryLimitReached);
  const isCoolingDown = retryAfterMs > 0;
  const retryLabel = getRetryButtonLabel(roadmap, isRetrying);
  const retryProgress = getRetryCooldownProgress(roadmap, retryAfterMs);

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-accent/20 bg-accent/10 p-10 text-center">
      <div>
        <p className="text-lg font-semibold text-foreground">
          CareerAI is generating your roadmap...
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Status: {roadmap.status}. This page checks for updates about every 15
          seconds while the AI worker runs.
        </p>
        {roadmap.failureReason && (
          <p className="mt-3 text-sm text-primary">
            {cleanRetryMessage(roadmap.failureReason)}
          </p>
        )}
        {isCoolingDown && (
          <div className="mt-4 h-2 w-full max-w-sm overflow-hidden rounded-full bg-background/60">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${retryProgress}%` }}
            />
          </div>
        )}
        {retryLimitReached && (
          <p className="mt-3 text-sm text-primary">
            Retry limit reached, please try again later.
          </p>
        )}
        {isTakingLonger && (
          <p className="mt-3 text-sm text-primary">
            AI is processing your roadmap and may be under high demand. Please
            be patient, or retry with a fresh request.
          </p>
        )}
      </div>
      {(isTakingLonger || isCoolingDown || retryLimitReached) && onRetry && (
        <Button
          variant="outline"
          className="rounded-2xl"
          onClick={onRetry}
          disabled={isCoolingDown || retryLimitReached || isRetrying}
        >
          {isRetrying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

function RoadmapLoading() {
  return <PageLoading title={true} grid={true} table={false} />;
}

function RoadmapEmpty() {
  return (
    <div className="rounded-3xl border border-border bg-card p-10 text-center">
      <Route className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
      <p className="font-semibold text-foreground">No roadmap generated yet</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose a target role and CareerAI will generate a roadmap from your
        latest resume analysis.
      </p>
    </div>
  );
}

function RoadmapIdleActiveNotice({ roadmap }: { roadmap: CareerRoadmap }) {
  return (
    <div className="rounded-3xl border border-primary/20 bg-primary/10 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-foreground">
            Previous roadmap generation is still marked {roadmap.status}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Live generation status will start only after you click Generate AI
            Roadmap. You can fill the form above and create a fresh roadmap
            without this older job taking over the page.
          </p>
        </div>
      </div>
    </div>
  );
}

function RoadmapReadyState() {
  return (
    <div className="rounded-3xl border border-accent/20 bg-accent/10 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent">
          <Route className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-foreground">
            Ready to build your personalized roadmap
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Add your career goals above and generate a fresh roadmap based on
            your latest resume analysis. Your previous incomplete attempt will
            not affect the new roadmap.
          </p>
        </div>
      </div>
    </div>
  );
}

function RoadmapError({
  message,
  roadmap,
  isRetrying,
  onRetry,
}: {
  message: string;
  roadmap?: CareerRoadmap;
  isRetrying?: boolean;
  onRetry?: () => void;
}) {
  const [, setRetryTick] = useState(0);
  const retryAfterMs = getRetryAfterMs(roadmap);
  const retryLimitReached =
    Boolean(roadmap?.retryLimitReached) ||
    message.toLowerCase().includes("retry limit reached");
  const retryLabel = getRetryButtonLabel(roadmap, isRetrying);

  useEffect(() => {
    if (retryAfterMs <= 0) return;
    const intervalId = window.setInterval(
      () => setRetryTick((value) => value + 1),
      1000,
    );
    return () => window.clearInterval(intervalId);
  }, [retryAfterMs]);

  return (
    <div className="space-y-4 rounded-3xl border border-destructive/20 bg-destructive/10 p-6">
      <div className="flex items-center gap-3 text-destructive">
        <AlertCircle className="h-5 w-5" />
        <p className="font-semibold">Roadmap unavailable</p>
      </div>
      <p className="text-sm text-muted-foreground">
        {cleanRetryMessage(message)}
      </p>
      {retryLimitReached && (
        <p className="text-sm text-primary">
          Retry limit reached, please try again later.
        </p>
      )}
      {onRetry ? (
        <Button
          variant="outline"
          className="rounded-2xl"
          onClick={onRetry}
          disabled={retryAfterMs > 0 || retryLimitReached || isRetrying}
        >
          {isRetrying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}

const retryMetadataPattern =
  /\s*\[retry:availableAt=[^\];]+;attempt=\d+;limit=\d+\]\s*/;

const cleanRetryMessage = (message?: string) =>
  (message || "").replace(retryMetadataPattern, "").trim();

const getRetryAfterMs = (roadmap?: CareerRoadmap) => {
  if (!roadmap) return 0;
  if (typeof roadmap.retryAfterMs === "number") {
    return Math.max(0, roadmap.retryAfterMs);
  }
  if (!roadmap.retryAvailableAt) return 0;

  const retryAt = new Date(roadmap.retryAvailableAt).getTime();
  if (Number.isNaN(retryAt)) return 0;
  return Math.max(0, retryAt - Date.now());
};

const formatRetryDelay = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  if (totalSeconds <= 0) return "now";

  const minutes = Math.ceil(totalSeconds / 60);
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }

  const hours = Math.ceil(minutes / 60);
  return `${hours} ${hours === 1 ? "hour" : "hours"}`;
};

const getRetryButtonLabel = (
  roadmap?: CareerRoadmap,
  isRetrying?: boolean,
) => {
  if (isRetrying) return "Retrying...";
  if (roadmap?.retryLimitReached) return "Retry limit reached";

  const retryAfterMs = getRetryAfterMs(roadmap);
  if (retryAfterMs > 0) {
    return `Retry in ${formatRetryDelay(retryAfterMs)}`;
  }

  return "Retry";
};

const getRetryCooldownProgress = (
  roadmap: CareerRoadmap,
  retryAfterMs: number,
) => {
  const retryAttempt = roadmap.retryAttempt ?? 1;
  const retryLimit = roadmap.retryLimit ?? 3;
  const retryAvailableAt = roadmap.retryAvailableAt
    ? new Date(roadmap.retryAvailableAt).getTime()
    : NaN;
  if (Number.isNaN(retryAvailableAt)) return 15;

  const expectedCooldownMs = retryAttempt >= retryLimit ? 60 * 60 * 1000 : 10 * 60 * 1000;
  const elapsedMs = Math.max(0, expectedCooldownMs - retryAfterMs);
  return Math.min(100, Math.max(8, (elapsedMs / expectedCooldownMs) * 100));
};

const getRoadmapGenerationErrorMessage = (message?: string) => {
  const lowerMessage = message?.toLowerCase() ?? "";

  if (lowerMessage.includes("groq_api_key") || lowerMessage.includes("groq api key")) {
    return "AI roadmap generation is not configured yet. Add your Groq API key on the backend, save the .env file, and restart the server.";
  }

  if (
    lowerMessage.includes("ai service limit") ||
    lowerMessage.includes("high demand") ||
    lowerMessage.includes("quota")
  ) {
    return "The AI service is currently experiencing high demand. Please try again later.";
  }

  return message || "Unable to start roadmap generation. Please try again.";
};
