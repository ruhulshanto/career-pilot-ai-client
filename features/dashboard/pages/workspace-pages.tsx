"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Activity, Calendar, Star } from "lucide-react";
import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { getWorkspaceHref } from "@/shared/lib/role-routing";
import { useAuthStore } from "@/shared/store/auth-store";
import { useWorkspaceBase } from "@/shared/hooks/use-workspace-base";
import { careerApi } from "@/services/api/career";
import {
  CareerReadinessPanel,
  CareerReadinessPanelFallback,
  CareerReadinessPanelSkeleton,
} from "@/features/career/components/career-readiness-panel";
import { DashboardActivityFeed } from "@/features/dashboard/components/dashboard-activity-feed";
import { DashboardAiJobs } from "@/features/dashboard/components/dashboard-ai-jobs";
import { DashboardError } from "@/features/dashboard/components/dashboard-error";
import { DashboardHero } from "@/features/dashboard/components/dashboard-hero";
import { DashboardInsightsPanel } from "@/features/dashboard/components/dashboard-insights-panel";
import { DashboardReminderCards } from "@/features/dashboard/components/dashboard-reminder-cards";
import { DashboardSkeleton } from "@/features/dashboard/components/dashboard-skeleton";
import { DashboardSkillGaps } from "@/features/dashboard/components/dashboard-skill-gaps";
import { DashboardSummaryCards } from "@/features/dashboard/components/dashboard-summary-cards";
import { JobGoalPanel } from "@/features/dashboard/components/job-goal-panel";
import { SkillAnalysisDetail } from "@/features/dashboard/components/skill-analysis-detail";
import { ChatbotPanel } from "@/features/chatbot/components/chatbot-panel";
import { InterviewHistory } from "@/features/interview/components/interview-history";
import { InterviewSimulationCard } from "@/features/interview/components/simulation-card";
import { NotificationList } from "@/features/notifications/components/notification-list";
import { onboardingApi } from "@/features/onboarding/api/onboarding-api";
import { OnboardingProgressCard } from "@/features/onboarding/components/onboarding-progress-card";
import { WalkthroughTip } from "@/features/onboarding/components/walkthrough-tip";
import { DashboardProfileCard } from "@/features/profile/components/dashboard-profile-card";
import { ResumeUploadPanel } from "@/features/resume/components/resume-upload-panel";
import { RoadmapViewer } from "@/features/roadmap/components/roadmap-viewer";
import { BillingSettings } from "@/features/settings/components/billing-settings";
import { NotificationsSettings } from "@/features/settings/components/notifications-settings";
import { ProfileForm } from "@/features/settings/components/profile-form";
import { SecurityAccount } from "@/features/settings/components/security-account";
import { SecuritySessions } from "@/features/settings/components/security-sessions";
import { SettingsSectionShell } from "@/features/settings/components/settings-section-shell";
import { useDashboardSummary } from "@/features/dashboard/hooks/use-dashboard-summary";

export function WorkspaceDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const workspaceBase = useWorkspaceBase();
  const { data, isLoading, isError, error, refetch, isFetching } =
    useDashboardSummary();
  const careerContextQuery = useQuery({
    queryKey: ["career-context"],
    queryFn: careerApi.getContext,
    staleTime: 30_000,
  });

  const displayName = user?.name?.split(" ")[0] || "there";

  return (
    <DashboardShell
      title="Dashboard"
      description="A concise view of your career metrics, recommended actions, and recent activity."
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? "Refreshing" : "Refresh"}
        </Button>
      }
    >
      {isLoading ? (
        <DashboardSkeleton />
      ) : isError || !data ? (
        <DashboardError
          message={
            (error as { message?: string } | null)?.message ??
            "The dashboard summary could not be loaded."
          }
          onRetry={() => refetch()}
        />
      ) : (
        <div className="space-y-8">
          <DashboardHero name={displayName} summary={data} />

          <OnboardingProgressCard />

          {careerContextQuery.isLoading ? (
            <CareerReadinessPanelSkeleton />
          ) : careerContextQuery.data ? (
            <CareerReadinessPanel context={careerContextQuery.data} />
          ) : (
            <CareerReadinessPanelFallback
              onRetry={() => {
                void careerContextQuery.refetch();
              }}
            />
          )}

          <DashboardSummaryCards summary={data} />

          <DashboardInsightsPanel insights={data.insights} trends={data.trends} />

          <DashboardReminderCards reminders={data.reminders} />

          <DashboardProfileCard />

          <JobGoalPanel summary={data} />

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <DashboardSkillGaps gaps={data.topSkillGaps} />
            <DashboardAiJobs jobs={data.processingAiJobs} />
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.6fr_0.9fr]">
            <div className="space-y-8">
              <DashboardActivityFeed activity={data.recentActivity} />

              <div className="grid gap-8 md:grid-cols-2">
                <ResumeUploadPanel />
                <Card>
                  <CardHeader className="flex items-center gap-3 border-b border-border/70 px-6 py-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base font-semibold">
                      Interview Practice
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center gap-4 p-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-muted/30">
                      <Activity className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <p className="max-w-[220px] text-sm leading-6 text-muted-foreground">
                      Completed sessions feed directly into your interview
                      average and readiness score.
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      className="px-5"
                    >
                      <Link href={getWorkspaceHref(workspaceBase, "interview")}>
                        Start Practice
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader className="flex items-center justify-between gap-3 border-b border-border/70 px-6 py-5">
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    AI Career Chat
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Chat guidance can contribute to future AI feedback and
                    activity signals.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Use the AI assistant to generate resume bullets, practice
                    answers, or explore opportunities.
                  </p>
                  <Button
                    asChild
                    variant="default"
                    className="w-full"
                  >
                    <Link href={getWorkspaceHref(workspaceBase, "chat")}>
                      Open AI Chat
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

export function WorkspaceResumePage() {
  return (
    <DashboardShell
      title="Resume Analysis"
      description="Upload your resume to surface tailored insights, ATS fit, and suggestions for higher interview conversion."
    >
      <div className="grid gap-8">
        <ResumeUploadPanel mode="center" />
      </div>
    </DashboardShell>
  );
}

export function WorkspaceRoadmapPage() {
  return (
    <DashboardShell
      title="Career Roadmap"
      description="Follow the next milestones in your professional path with clear status and priority recommendations."
    >
      <div className="grid gap-8">
        <WalkthroughTip
          title="Roadmap walkthrough"
          description="Generate a roadmap from your resume, then work the first incomplete milestone before adding more goals."
        />
        <RoadmapViewer />
      </div>
    </DashboardShell>
  );
}

export function WorkspaceInterviewPage() {
  return (
    <Suspense fallback={null}>
      <InterviewPageContent />
    </Suspense>
  );
}

function InterviewPageContent() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const careerContextQuery = useQuery({
    queryKey: ["career-context"],
    queryFn: careerApi.getContext,
    staleTime: 30_000,
  });
  const initialRole =
    searchParams.get("role") ??
    careerContextQuery.data?.roadmap.targetRole ??
    careerContextQuery.data?.resume.inferredTargetRole ??
    undefined;
  const initialLevel =
    searchParams.get("level") ??
    careerContextQuery.data?.roadmap.currentLevel ??
    careerContextQuery.data?.resume.experienceLevel ??
    undefined;

  return (
    <DashboardShell title="Interview Practice">
      <div className="space-y-8">
        <WalkthroughTip
          title="Interview walkthrough"
          description="Start with the role suggested by your resume or roadmap, answer each prompt, then review feedback to improve readiness."
        />
        <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
          <InterviewSimulationCard
            activeSessionId={activeSessionId}
            onSessionChange={setActiveSessionId}
            initialRole={initialRole}
            initialLevel={initialLevel}
          />

          <div className="space-y-8">
            <InterviewHistory
              activeSessionId={activeSessionId}
              onSelectSession={setActiveSessionId}
            />

            <Card>
              <CardContent className="space-y-6 p-6">
                <div className="flex items-center justify-between gap-4">
                  <Star className="h-8 w-8 text-primary" />
                  <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Premium
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-foreground">
                    Upgrade to Premium
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Access advanced interview simulations and detailed
                    performance analytics.
                  </p>
                </div>
                <Button className="w-full">
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

export function WorkspaceSkillAnalysisPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useDashboardSummary();

  return (
    <DashboardShell
      title="Skill Analysis"
      description="Detailed skill gaps, learning goals, progress, and resources based on your latest career signals."
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? "Refreshing" : "Refresh"}
        </Button>
      }
    >
      {isLoading ? (
        <DashboardSkeleton />
      ) : isError || !data ? (
        <DashboardError
          message={
            (error as { message?: string } | null)?.message ??
            "The skill analysis could not be loaded."
          }
          onRetry={() => refetch()}
        />
      ) : (
        <SkillAnalysisDetail gaps={data.topSkillGaps} />
      )}
    </DashboardShell>
  );
}

export function WorkspaceJobMatchesPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useDashboardSummary();
  const markViewedMutation = useMutation({
    mutationFn: () => onboardingApi.completeStep("VIEW_JOB_MATCHES"),
  });

  useEffect(() => {
    if (!markViewedMutation.isIdle) return;
    markViewedMutation.mutate();
  }, [markViewedMutation]);

  return (
    <DashboardShell
      title="Job Matches"
      description="Review aligned jobs, track applications, and create career goals from your live career context."
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? "Refreshing" : "Refresh"}
        </Button>
      }
    >
      <div className="space-y-6">
        <WalkthroughTip
          title="How to use job matches"
          description="Refresh matches after resume or roadmap changes, track roles you like, then create one goal that keeps your job search focused."
        />

        {isLoading ? (
          <DashboardSkeleton />
        ) : isError || !data ? (
          <DashboardError
            message={
              (error as { message?: string } | null)?.message ??
              "Job matches could not be loaded."
            }
            onRetry={() => refetch()}
          />
        ) : (
          <div id="career-goals">
            <JobGoalPanel summary={data} />
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

export function WorkspaceChatPage() {
  return (
    <DashboardShell
      title="Career Assistant"
      description="Ask questions, run simulations, and get immediate career guidance from the AI assistant."
    >
      <div className="space-y-6">
        <WalkthroughTip
          title="Mentor walkthrough"
          description="Ask for a weekly plan, resume bullet feedback, interview practice ideas, or the next action from your career context."
        />
        <ChatbotPanel />
      </div>
    </DashboardShell>
  );
}

export function WorkspaceNotificationsPage() {
  return (
    <DashboardShell
      title="Notifications"
      description="Stay on top of system updates, signals, and alerts that impact your career plan."
    >
      <NotificationList />
    </DashboardShell>
  );
}

export function WorkspaceSettingsProfilePage() {
  return (
    <SettingsSectionShell>
      <ProfileForm />
    </SettingsSectionShell>
  );
}

export function WorkspaceSettingsNotificationsPage() {
  return (
    <SettingsSectionShell>
      <NotificationsSettings />
    </SettingsSectionShell>
  );
}

export function WorkspaceSettingsSecurityPage() {
  return (
    <SettingsSectionShell>
      <SecurityAccount />
      <SecuritySessions />
    </SettingsSectionShell>
  );
}

export function WorkspaceSettingsBillingPage() {
  return (
    <SettingsSectionShell>
      <BillingSettings />
    </SettingsSectionShell>
  );
}
