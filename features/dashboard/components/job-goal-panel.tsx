"use client";

import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  FileSearch,
  Info,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Target,
  X,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/hooks/use-toast";
import {
  jobsApi,
  type CareerGoal,
  type CreateApplicationPayload,
  type JobApplication,
  type JobFitAnalysis,
  type JobMatch,
  type UpdateApplicationPayload,
  type UpdateGoalPayload,
} from "@/services/api/jobs";
import { onboardingQueryKeys } from "@/features/onboarding/api/onboarding-api";
import { dashboardQueryKeys } from "../hooks/use-dashboard-summary";
import type { DashboardSummary } from "../types/dashboard";

type Props = {
  summary: DashboardSummary;
};

const applicationStatuses = [
  { value: "SAVED", label: "Saved" },
  { value: "APPLIED", label: "Applied" },
  { value: "INTERVIEW_SCHEDULED", label: "Interviewing" },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
  { value: "WITHDRAWN", label: "Withdrawn" },
];

const pipelineColumns = applicationStatuses.filter(
  (status) => status.value !== "WITHDRAWN",
);

const goalStatuses = [
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
  { value: "COMPLETED", label: "Completed" },
];

const emptyManualApplication: CreateApplicationPayload = {
  title: "",
  company: "",
  location: "",
  source: "Manual Tracker",
  jobUrl: "",
  status: "SAVED",
  notes: "",
};

const statusLabel = (value?: string) =>
  applicationStatuses.find((status) => status.value === value)?.label ??
  goalStatuses.find((status) => status.value === value)?.label ??
  value?.replaceAll("_", " ").toLowerCase() ??
  "Unknown";

const statusClass = (value?: string) => {
  if (value === "OFFER" || value === "COMPLETED")
    return "bg-accent/10 text-accent";
  if (value === "INTERVIEW_SCHEDULED") return "bg-primary/10 text-primary";
  if (value === "REJECTED" || value === "WITHDRAWN")
    return "bg-destructive/10 text-destructive";
  if (value === "PAUSED") return "bg-primary/10 text-primary";
  return "bg-muted text-muted-foreground";
};

const errorDescription = (error: unknown) =>
  error && typeof error === "object" && "message" in error
    ? String((error as { message?: unknown }).message)
    : error instanceof Error
      ? error.message
      : "Please try again in a moment.";

export function JobGoalPanel({ summary }: Props) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [manualApplication, setManualApplication] =
    useState<CreateApplicationPayload>(emptyManualApplication);
  const [analysisDraft, setAnalysisDraft] = useState({
    title: "",
    company: "",
    description: "",
  });
  const [analysis, setAnalysis] = useState<JobFitAnalysis | null>(null);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [goalDraft, setGoalDraft] = useState({
    title: "",
    progress: 0,
    status: "ACTIVE",
  });

  const refreshDashboardData = () => {
    void queryClient.invalidateQueries({ queryKey: ["jobs", "recommendations"] });
    void queryClient.invalidateQueries({ queryKey: ["jobs", "applications"] });
    void queryClient.invalidateQueries({ queryKey: ["jobs", "goals"] });
    void queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.summary });
    void queryClient.invalidateQueries({ queryKey: onboardingQueryKeys.all });
  };

  const jobsQuery = useQuery<JobMatch[]>({
    queryKey: ["jobs", "recommendations"],
    queryFn: jobsApi.getRecommendations,
    initialData: summary.recommendedJobs as JobMatch[],
    initialDataUpdatedAt: 0,
    staleTime: 30_000,
  });
  const applicationsQuery = useQuery<JobApplication[]>({
    queryKey: ["jobs", "applications"],
    queryFn: jobsApi.getApplications,
    initialData: summary.applications as JobApplication[],
    initialDataUpdatedAt: 0,
    staleTime: 30_000,
  });
  const goalsQuery = useQuery<CareerGoal[]>({
    queryKey: ["jobs", "goals"],
    queryFn: jobsApi.getGoals,
    initialData: summary.careerGoals as CareerGoal[],
    initialDataUpdatedAt: 0,
    staleTime: 30_000,
  });

  const refreshMutation = useMutation({
    mutationFn: jobsApi.refreshRecommendations,
    onSuccess: () => {
      refreshDashboardData();
      toast({
        variant: "success",
        title: "Search leads refreshed",
        description:
          "The assistant rebuilt job search links from your latest resume and roadmap signals.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Could not refresh search leads",
        description: errorDescription(error),
      });
    },
  });

  const saveLeadMutation = useMutation({
    mutationFn: jobsApi.saveLead,
    onSuccess: () => {
      refreshDashboardData();
      toast({
        variant: "success",
        title: "Lead saved",
        description: "The lead is now visible in your application pipeline.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Could not save lead",
        description: errorDescription(error),
      });
    },
  });

  const createApplicationMutation = useMutation({
    mutationFn: jobsApi.createApplication,
    onSuccess: () => {
      setManualApplication(emptyManualApplication);
      refreshDashboardData();
      toast({
        variant: "success",
        title: "Application tracked",
        description: "The opportunity was added to your pipeline.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Could not add application",
        description: errorDescription(error),
      });
    },
  });

  const updateApplicationMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateApplicationPayload;
    }) => jobsApi.updateApplication(id, payload),
    onSuccess: () => {
      refreshDashboardData();
      toast({
        variant: "success",
        title: "Pipeline updated",
        description: "The application status is saved.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Could not update application",
        description: errorDescription(error),
      });
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: jobsApi.analyzeJobDescription,
    onSuccess: (result) => {
      setAnalysis(result);
      toast({
        variant: "success",
        title: "Job fit analyzed",
        description: "The match report uses your current resume and roadmap signals.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Could not analyze description",
        description: errorDescription(error),
      });
    },
  });

  const goalMutation = useMutation({
    mutationFn: () =>
      jobsApi.createGoal({
        title: newGoalTitle.trim(),
        nextSteps: [
          "Refresh smart search leads",
          "Track 3 real applications",
          "Analyze one job description before applying",
        ],
      }),
    onSuccess: () => {
      setNewGoalTitle("");
      refreshDashboardData();
      toast({
        variant: "success",
        title: "Career goal added",
        description: "Your job search goal is now tracked.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Could not add goal",
        description: errorDescription(error),
      });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGoalPayload }) =>
      jobsApi.updateGoal(id, payload),
    onSuccess: () => {
      setEditingGoalId(null);
      refreshDashboardData();
      toast({
        variant: "success",
        title: "Goal updated",
        description: "Your goal progress is saved.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Could not update goal",
        description: errorDescription(error),
      });
    },
  });

  const jobs = jobsQuery.data ?? [];
  const applications = applicationsQuery.data ?? [];
  const goals = goalsQuery.data ?? [];
  const applicationsByStatus = useMemo(
    () =>
      pipelineColumns.map((column) => ({
        ...column,
        applications: applications.filter(
          (application) => application.status === column.value,
        ),
      })),
    [applications],
  );
  const canCreateApplication =
    manualApplication.title.trim().length >= 2 &&
    manualApplication.company.trim().length >= 2;
  const canAnalyze = analysisDraft.description.trim().length >= 20;

  const startEditingGoal = (goal: CareerGoal) => {
    setEditingGoalId(goal.id);
    setGoalDraft({
      title: goal.title,
      progress: goal.progress,
      status: goal.status,
    });
  };

  const saveGoal = (goal: CareerGoal) => {
    updateGoalMutation.mutate({
      id: goal.id,
      payload: {
        title: goalDraft.title.trim() || goal.title,
        progress: goalDraft.progress,
        status: goalDraft.progress >= 100 ? "COMPLETED" : goalDraft.status,
      },
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-4 border-b border-border/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileSearch className="h-5 w-5 text-primary" />
                Smart Job Search Assistant
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Builds legal external search links from your resume, roadmap,
                skill gaps, and interview signals. No scraping. No unofficial
                LinkedIn API.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => refreshMutation.mutate()}
              disabled={refreshMutation.isPending}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Leads
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {jobs.length === 0 ? (
              <EmptyState
                title="No search leads yet"
                description="Refresh leads after uploading a resume or generating a roadmap. The assistant will create search links instead of fake job postings."
              />
            ) : (
              jobs.slice(0, 5).map((job) => (
                <div
                  key={job.id}
                  className="rounded-xl border border-border/70 p-4 transition hover:border-primary/40"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {job.sourceLabel}
                        </span>
                        {job.isSearchAssistant && (
                          <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                            Search lead
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground">
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {job.company}
                        {job.location ? ` - ${job.location}` : ""}
                      </p>
                    </div>
                    <span className="w-fit rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-foreground">
                      {job.matchScore}% fit
                    </span>
                  </div>

                  <SkillChips
                    matches={job.skillsMatch}
                    gaps={job.missingSkills}
                  />

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <MiniList
                      title="Why this lead"
                      items={job.matchReasons}
                      fallback="Built from your current career profile."
                    />
                    <MiniList
                      title="Before applying"
                      items={job.recommendedImprovements}
                      fallback="Open the search result, inspect real postings, then track the specific role."
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      className="w-full sm:w-auto"
                      variant={job.applicationStatus ? "outline" : "default"}
                      onClick={() => saveLeadMutation.mutate(job.id)}
                      disabled={
                        Boolean(job.applicationStatus) ||
                        saveLeadMutation.isPending
                      }
                    >
                      {job.applicationStatus ? "Saved" : "Save Lead"}
                    </Button>
                    {job.jobUrl && (
                      <Button
                        asChild
                        variant="outline"
                        className="h-10"
                      >
                        <a href={job.jobUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open Search
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border/70 px-6 py-5">
            <CardTitle className="flex items-center gap-2 text-base">
              <BriefcaseBusiness className="h-5 w-5 text-primary" />
              Application Pipeline
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Track real roles from any job board with source, status, notes,
              dates, and search context.
            </p>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <ManualApplicationForm
              value={manualApplication}
              onChange={setManualApplication}
              onSubmit={() =>
                createApplicationMutation.mutate({
                  ...manualApplication,
                  title: manualApplication.title.trim(),
                  company: manualApplication.company.trim(),
                  location: manualApplication.location?.trim() || undefined,
                  source: manualApplication.source?.trim() || "Manual Tracker",
                  jobUrl: manualApplication.jobUrl?.trim() || undefined,
                  notes: manualApplication.notes?.trim() || undefined,
                })
              }
              canSubmit={canCreateApplication}
              disabled={createApplicationMutation.isPending}
            />

            {applications.length === 0 ? (
              <EmptyState
                title="Your pipeline is empty"
                description="Save a search lead or manually add a real posting to begin tracking applications."
              />
            ) : (
              <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
                {applicationsByStatus.map((column) => (
                  <div
                    key={column.value}
                    className="min-w-0 rounded-xl border border-border/70 bg-muted/20 p-3"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <h3 className="min-w-0 truncate text-sm font-semibold text-foreground">
                        {column.label}
                      </h3>
                      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {column.applications.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {column.applications.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border/80 bg-background/45 px-3 py-4 text-center text-xs leading-5 text-muted-foreground">
                          No {column.label.toLowerCase()} roles yet.
                        </div>
                      ) : (
                        column.applications.map((application) => (
                          <ApplicationCard
                            key={application.id}
                            application={application}
                            onStatusChange={(status) =>
                              updateApplicationMutation.mutate({
                                id: application.id,
                                payload: { status },
                              })
                            }
                            disabled={updateApplicationMutation.isPending}
                          />
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="border-b border-border/70 px-6 py-5">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-5 w-5 text-primary" />
              Resume vs Job Description
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Paste a real posting to estimate fit before applying.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <Input
              value={analysisDraft.title}
              onChange={(event) =>
                setAnalysisDraft((draft) => ({
                  ...draft,
                  title: event.target.value,
                }))
              }
              placeholder="Role title"
              className="h-10"
            />
            <Input
              value={analysisDraft.company}
              onChange={(event) =>
                setAnalysisDraft((draft) => ({
                  ...draft,
                  company: event.target.value,
                }))
              }
              placeholder="Company"
              className="h-10"
            />
            <textarea
              value={analysisDraft.description}
              onChange={(event) =>
                setAnalysisDraft((draft) => ({
                  ...draft,
                  description: event.target.value,
                }))
              }
              placeholder="Paste the job description..."
              className="min-h-40 w-full rounded-lg border border-input bg-background/55 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
            <Button
              className="w-full"
              onClick={() => analyzeMutation.mutate(analysisDraft)}
              disabled={!canAnalyze || analyzeMutation.isPending}
            >
              Analyze Fit
            </Button>
            {analysis && <FitAnalysisResult analysis={analysis} />}
          </CardContent>
        </Card>

        <CareerGoalsCard
          goals={goals}
          newGoalTitle={newGoalTitle}
          setNewGoalTitle={setNewGoalTitle}
          canCreateGoal={newGoalTitle.trim().length >= 3}
          createGoal={() => goalMutation.mutate()}
          createPending={goalMutation.isPending}
          editingGoalId={editingGoalId}
          goalDraft={goalDraft}
          setGoalDraft={setGoalDraft}
          startEditingGoal={startEditingGoal}
          cancelEditing={() => setEditingGoalId(null)}
          saveGoal={saveGoal}
          updatePending={updateGoalMutation.isPending}
        />
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-6 text-center">
      <Info className="mx-auto mb-3 h-7 w-7 text-primary" />
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function SkillChips({
  matches = [],
  gaps = [],
}: {
  matches?: string[];
  gaps?: string[];
}) {
  if (!matches.length && !gaps.length) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {matches.slice(0, 4).map((skill) => (
        <span
          key={skill}
          className="rounded-full bg-accent/10 px-2.5 py-1 text-xs text-accent"
        >
          Match: {skill}
        </span>
      ))}
      {gaps.slice(0, 4).map((skill) => (
        <span
          key={skill}
          className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary"
        >
          Gap: {skill}
        </span>
      ))}
    </div>
  );
}

function MiniList({
  title,
  items = [],
  fallback,
}: {
  title: string;
  items?: string[];
  fallback: string;
}) {
  const resolved = items.length ? items.slice(0, 3) : [fallback];

  return (
    <div className="rounded-lg bg-muted/25 p-3">
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h4>
      <ul className="space-y-1 text-xs leading-5 text-muted-foreground">
        {resolved.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}

function ManualApplicationForm({
  value,
  onChange,
  onSubmit,
  canSubmit,
  disabled,
}: {
  value: CreateApplicationPayload;
  onChange: (value: CreateApplicationPayload) => void;
  onSubmit: () => void;
  canSubmit: boolean;
  disabled: boolean;
}) {
  return (
    <div className="rounded-xl border border-border/70 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          Add real application
        </h3>
        <p className="text-xs text-muted-foreground">
          Use this for roles you find on LinkedIn, company career pages, or
          other job boards.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Input
          value={value.title}
          onChange={(event) => onChange({ ...value, title: event.target.value })}
          placeholder="Role"
          className="h-10"
        />
        <Input
          value={value.company}
          onChange={(event) =>
            onChange({ ...value, company: event.target.value })
          }
          placeholder="Company"
          className="h-10"
        />
        <Input
          value={value.location}
          onChange={(event) =>
            onChange({ ...value, location: event.target.value })
          }
          placeholder="Location"
          className="h-10"
        />
        <Input
          value={value.jobUrl}
          onChange={(event) =>
            onChange({ ...value, jobUrl: event.target.value })
          }
          placeholder="Job URL"
          className="h-10"
        />
        <select
          className="h-10 rounded-lg border border-input bg-background/55 px-3 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          value={value.status}
          onChange={(event) => onChange({ ...value, status: event.target.value })}
          title="Initial application status"
        >
          {applicationStatuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        <Input
          value={value.source}
          onChange={(event) =>
            onChange({ ...value, source: event.target.value })
          }
          placeholder="Source"
          className="h-10"
        />
      </div>
      <textarea
        value={value.notes}
        onChange={(event) => onChange({ ...value, notes: event.target.value })}
        placeholder="Notes"
        className="mt-3 min-h-20 w-full rounded-lg border border-input bg-background/55 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />
      <Button
        className="mt-3 h-10"
        onClick={onSubmit}
        disabled={!canSubmit || disabled}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add to Pipeline
      </Button>
    </div>
  );
}

function ApplicationCard({
  application,
  onStatusChange,
  disabled,
}: {
  application: JobApplication;
  onStatusChange: (status: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-border/70 bg-background/60 p-3">
      <h4 className="line-clamp-2 break-words text-sm font-semibold text-foreground">
        {application.title}
      </h4>
      <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">
        {application.company}
        {application.location ? ` - ${application.location}` : ""}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span
          className={`max-w-full truncate rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(application.status)}`}
        >
          {statusLabel(application.status)}
        </span>
        {application.sourceLabel && (
          <span className="max-w-full truncate rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
            {application.sourceLabel}
          </span>
        )}
      </div>
      <select
        className="mt-3 h-9 w-full min-w-0 rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
        value={application.status}
        onChange={(event) => onStatusChange(event.target.value)}
        disabled={disabled}
        title="Change application status"
      >
        {applicationStatuses.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
      {application.notes && (
        <p className="mt-3 line-clamp-3 text-xs leading-5 text-muted-foreground">
          {application.notes}
        </p>
      )}
      {application.jobUrl && (
        <a
          href={application.jobUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex max-w-full items-center gap-1 break-all text-xs font-medium text-primary hover:text-primary/80"
        >
          <span className="truncate">Open posting</span>
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
      )}
    </div>
  );
}

function FitAnalysisResult({ analysis }: { analysis: JobFitAnalysis }) {
  return (
    <div className="rounded-xl border border-accent/20 bg-accent/10 p-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">ATS Fit</h3>
          <p className="text-xs text-muted-foreground">
            Based on resume, roadmap, and skill signals
          </p>
        </div>
        <span className="text-3xl font-semibold text-foreground">
          {analysis.atsMatchPercent}%
        </span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${analysis.atsMatchPercent}%` }}
        />
      </div>
      <div className="mt-4 space-y-3">
        <MiniList
          title="Matching strengths"
          items={analysis.matchingStrengths}
          fallback="No strong overlap detected yet."
        />
        <MiniList
          title="Missing skills"
          items={analysis.missingSkills}
          fallback="No major missing skill signal detected."
        />
        <MiniList
          title="Recommended improvements"
          items={analysis.recommendedImprovements}
          fallback="Tailor your resume summary and project bullets to this role."
        />
      </div>
    </div>
  );
}

function CareerGoalsCard({
  goals,
  newGoalTitle,
  setNewGoalTitle,
  canCreateGoal,
  createGoal,
  createPending,
  editingGoalId,
  goalDraft,
  setGoalDraft,
  startEditingGoal,
  cancelEditing,
  saveGoal,
  updatePending,
}: {
  goals: CareerGoal[];
  newGoalTitle: string;
  setNewGoalTitle: (value: string) => void;
  canCreateGoal: boolean;
  createGoal: () => void;
  createPending: boolean;
  editingGoalId: string | null;
  goalDraft: { title: string; progress: number; status: string };
  setGoalDraft: Dispatch<
    SetStateAction<{ title: string; progress: number; status: string }>
  >;
  startEditingGoal: (goal: CareerGoal) => void;
  cancelEditing: () => void;
  saveGoal: (goal: CareerGoal) => void;
  updatePending: boolean;
}) {
  return (
    <Card>
      <CardHeader className="border-b border-border/70 px-6 py-5">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-5 w-5 text-primary" />
          Career Goals
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Keep job search goals tied to progress, applications, and interview
          preparation.
        </p>
      </CardHeader>
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={newGoalTitle}
            onChange={(event) => setNewGoalTitle(event.target.value)}
            placeholder="Add a goal"
            className="h-10"
          />
          <Button
            className="w-full sm:w-auto"
            onClick={createGoal}
            disabled={!canCreateGoal || createPending}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>

        {goals.length === 0 ? (
          <EmptyState
            title="No active goals"
            description="Add one measurable job-search goal to keep your pipeline work focused."
          />
        ) : (
          goals.slice(0, 5).map((goal) => {
            const isEditing = editingGoalId === goal.id;

            return (
              <div
                key={goal.id}
                className="rounded-xl border border-border/70 p-4 transition hover:border-primary/40"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                  <div className="min-w-0 flex-1 space-y-3">
                    {isEditing ? (
                      <Input
                        value={goalDraft.title}
                        onChange={(event) =>
                          setGoalDraft((draft) => ({
                            ...draft,
                            title: event.target.value,
                          }))
                        }
                        className="h-10"
                      />
                    ) : (
                      <h3 className="font-semibold text-foreground">
                        {goal.title}
                      </h3>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(isEditing ? goalDraft.status : goal.status)}`}
                      >
                        {statusLabel(isEditing ? goalDraft.status : goal.status)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {isEditing ? goalDraft.progress : goal.progress}%
                        complete
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${isEditing ? goalDraft.progress : goal.progress}%`,
                        }}
                      />
                    </div>

                    {isEditing && (
                      <div className="space-y-2">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={goalDraft.progress}
                          onChange={(event) =>
                            setGoalDraft((draft) => ({
                              ...draft,
                              progress: Number(event.target.value),
                            }))
                          }
                          className="w-full accent-primary"
                          aria-label="Goal progress percentage"
                        />
                        <select
                          className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
                          title="Change goal status"
                          value={goalDraft.status}
                          onChange={(event) =>
                            setGoalDraft((draft) => ({
                              ...draft,
                              status: event.target.value,
                            }))
                          }
                        >
                          {goalStatuses.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {isEditing ? (
                      <>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-9 w-9 rounded-xl"
                          onClick={() => saveGoal(goal)}
                          disabled={updatePending}
                          aria-label="Save career goal"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 rounded-xl"
                          onClick={cancelEditing}
                          aria-label="Cancel goal editing"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 rounded-xl"
                        onClick={() => startEditingGoal(goal)}
                        aria-label="Edit career goal"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
