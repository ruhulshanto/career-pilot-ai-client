"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Activity,
  Bell,
  Bot,
  BriefcaseBusiness,
  Cloud,
  Clock,
  Database,
  FileText,
  GitBranch,
  MessageSquare,
  RefreshCw,
  Route,
  Server,
  ShieldAlert,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import { DashboardError } from "@/features/dashboard/components/dashboard-error";
import { DashboardSkeleton } from "@/features/dashboard/components/dashboard-skeleton";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { adminApi, type AdminDashboard as AdminDashboardData } from "@/services/api/admin";
import { cn } from "@/shared/lib/utils";
import { useToast } from "@/shared/hooks/use-toast";

const metricCards = [
  { key: "totalUsers", label: "Total users", icon: Users },
  { key: "activeUsers", label: "Active users", icon: Activity },
  { key: "resumesAnalyzed", label: "Resumes analyzed", icon: FileText },
  { key: "roadmapsGenerated", label: "Roadmaps generated", icon: Route },
  { key: "interviewsCompleted", label: "Interviews completed", icon: Video },
  { key: "chatbotMessages", label: "Chatbot messages", icon: MessageSquare },
  { key: "jobApplications", label: "Job applications", icon: BriefcaseBusiness },
  { key: "notificationsSent", label: "Notifications sent", icon: Bell },
] as const;

export function AdminDashboard() {
  const { toast } = useToast();
  const query = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: adminApi.dashboard,
    refetchInterval: 30_000,
  });

  if (query.isLoading) return <DashboardSkeleton />;

  if (query.isError || !query.data) {
    return (
      <DashboardError
        message={(query.error as { message?: string })?.message ?? "Admin analytics could not be loaded."}
        onRetry={() => query.refetch()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <DashboardSnapshotHeader
        data={query.data}
        onRefresh={() => query.refetch()}
        isRefreshing={query.isFetching}
      />

      <MetricGrid data={query.data} />
      <MonitoringGrid data={query.data} />
      <AiUsage data={query.data} />
      <Charts data={query.data} />
      <AdminTables
        data={query.data}
        onRetryComplete={() => query.refetch()}
        toast={toast}
      />
    </div>
  );
}

function DashboardSnapshotHeader({
  data,
  onRefresh,
  isRefreshing,
}: {
  data: AdminDashboardData;
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  const summaryItems = [
    {
      label: "Users",
      value: formatNumber(data.cards.totalUsers),
      detail: `${formatNumber(data.cards.activeUsers)} active`,
      icon: Users,
    },
    {
      label: "AI requests",
      value: formatNumber(data.aiUsage.totalRequests),
      detail: `${formatNumber(data.aiUsage.failedRequests)} failed`,
      icon: Bot,
    },
    {
      label: "Job activity",
      value: formatNumber(data.cards.jobApplications),
      detail: `${formatNumber(data.cards.interviewsCompleted)} interviews`,
      icon: BriefcaseBusiness,
    },
    {
      label: "System health",
      value: data.monitoring.systemStatus,
      detail: `${data.monitoring.failedJobs} failed jobs`,
      icon: ShieldAlert,
    },
  ];

  return (
    <Card className="rounded-[2rem] border border-border bg-white/90 shadow-sm dark:bg-slate-950/80">
      <CardContent className="space-y-6 p-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-muted/5 p-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-primary">Platform snapshot</p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Admin dashboard</h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              A clean, professional snapshot of system activity, AI usage, and operational health.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Updated {new Date(data.generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            <Button
              variant="outline"
              onClick={onRefresh}
              loading={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh snapshot
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-3xl border border-border bg-background/80 p-5 shadow-sm">
                <div className="flex items-center gap-3 text-primary">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
                <p className="mt-5 text-3xl font-semibold tracking-tight text-foreground">{item.value}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function MetricGrid({ data }: { data: AdminDashboardData }) {
  const heroCards = metricCards.slice(0, 4);
  const quickTotals = metricCards.slice(4);

  return (
    <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
      <Card className="rounded-3xl border border-border bg-white/80 shadow-sm dark:bg-slate-900/80">
        <CardHeader className="space-y-1 px-6 pt-6">
          <CardTitle className="text-2xl">Platform overview</CardTitle>
          <CardDescription>
            High-level admin metrics for key usage, growth, and engagement trends.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
          {heroCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.key}
                className="rounded-3xl border border-border bg-background/70 p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className="mt-3 text-4xl font-semibold tracking-tight">
                      {formatNumber(data.cards[card.key])}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="rounded-3xl border border-border bg-background/95">
        <CardHeader className="px-6 pt-6">
          <CardTitle className="text-lg">Quick totals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-6 pb-6 pt-2">
          {quickTotals.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.key}
                className="flex items-center justify-between rounded-3xl border border-border bg-muted/5 p-4"
              >
                <div>
                  <p className="text-sm font-semibold">{card.label}</p>
                  <p className="mt-1 text-2xl font-bold tracking-tight">
                    {formatNumber(data.cards[card.key])}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function MonitoringGrid({ data }: { data: AdminDashboardData }) {
  const totalWaiting = data.monitoring.queueHealth.reduce(
    (sum, queue) => sum + queue.waiting + queue.delayed,
    0
  );
  const queueHealthy =
    data.monitoring.failedJobs === 0 &&
    data.monitoring.queueHealth.every((queue) => queue.healthy);

  const statusCards = [
    {
      icon: Activity,
      label: "System",
      status: data.monitoring.systemStatus,
      detail: `${formatDuration(data.monitoring.uptimeSeconds)} uptime`,
    },
    {
      icon: Database,
      label: "Database",
      status: data.monitoring.database.status,
      detail: data.monitoring.database.schema?.missing?.length
        ? `${data.monitoring.database.schema.missing.length} schema migration pending`
        : `Postgres ${data.monitoring.database.latencyMs ?? 0}ms`,
    },
    {
      icon: Server,
      label: "Redis",
      status: data.monitoring.redis.status,
      detail: `Cache and queues ${data.monitoring.redis.latencyMs ?? 0}ms`,
    },
    {
      icon: ShieldAlert,
      label: "Queue health",
      status: queueHealthy ? "online" : "degraded",
      detail: `${data.monitoring.failedJobs} failed · ${data.monitoring.stuckJobs} stuck · ${totalWaiting} waiting`,
    },
    {
      icon: Cloud,
      label: "Storage",
      status: data.monitoring.storage.status,
      detail: `${data.monitoring.storage.provider} · ${
        data.monitoring.storage.writable ? "writable" : "read-only"
      }`,
    },
  ];

  return (
    <Card className="rounded-3xl border border-border bg-background/95 shadow-sm">
      <CardHeader className="space-y-3 px-6 pt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="text-2xl">Operational health</CardTitle>
            <CardDescription>
              Live platform status and infrastructure health in one clear view.
            </CardDescription>
          </div>
          <span className="rounded-full border border-border bg-muted/10 px-3 py-1 text-sm font-medium text-muted-foreground">
            Auto-refresh every 30 seconds
          </span>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statusCards.map((card) => (
          <StatusCard
            key={card.label}
            icon={card.icon}
            label={card.label}
            status={card.status}
            detail={card.detail}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function StatusCard({
  icon: Icon,
  label,
  status,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  status: string;
  detail: string;
}) {
  const isOnline = status.toLowerCase() === "online";
  const statusTone = isOnline
    ? "bg-emerald-500/10 text-emerald-700"
    : "bg-amber-500/10 text-amber-700";

  return (
    <Card className="rounded-3xl border border-border bg-white/90 shadow-sm dark:bg-slate-950/80">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">Service status</p>
            </div>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${statusTone} whitespace-nowrap`}
          >
            {status}
          </span>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

function AiUsage({ data }: { data: AdminDashboardData }) {
  const failureRate = data.aiUsage.totalRequests
    ? Math.round((data.aiUsage.failedRequests / data.aiUsage.totalRequests) * 100)
    : 0;

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <Card className="rounded-2xl xl:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Bot className="h-5 w-5 text-primary" />
            AI usage analytics
          </CardTitle>
          <CardDescription>
            Request volume, failures, retry estimates, providers, and token estimates.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SmallStat label="Total AI requests" value={formatNumber(data.aiUsage.totalRequests)} />
          <SmallStat label="Failed requests" value={formatNumber(data.aiUsage.failedRequests)} />
          <SmallStat label="Failure rate" value={`${failureRate}%`} />
          <SmallStat label="Token estimate" value={formatNumber(data.aiUsage.totalTokens)} />
          <SmallStat label="Provider health" value={data.monitoring.ai.status} />
          <SmallStat
            label="Environment"
            value={data.monitoring.environment.productionReady ? "Ready" : "Review"}
          />
        </CardContent>
      </Card>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Provider usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.aiUsage.providerUsage.length ? (
            data.aiUsage.providerUsage.map((provider) => (
              <BarRow
                key={provider.provider}
                label={provider.provider}
                value={provider.count}
                max={Math.max(...data.aiUsage.providerUsage.map((item) => item.count), 1)}
              />
            ))
          ) : (
            <EmptyText>No AI requests yet.</EmptyText>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Charts({ data }: { data: AdminDashboardData }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <TrendChart title="User growth" field="users" data={data} />
      <TrendChart title="Roadmap generation trends" field="roadmaps" data={data} />
      <TrendChart title="Interview activity" field="interviews" data={data} />
      <TrendChart title="AI request volume" field="aiRequests" data={data} />
    </div>
  );
}

function TrendChart({
  title,
  field,
  data,
}: {
  title: string;
  field: "users" | "roadmaps" | "interviews" | "aiRequests";
  data: AdminDashboardData;
}) {
  const max = Math.max(...data.charts.trends.map((point) => point[field]), 1);
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <GitBranch className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-44 items-end gap-2">
          {data.charts.trends.map((point) => {
            const height = Math.max(6, (point[field] / max) * 100);
            return (
              <div key={`${field}-${point.date}`} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <div className="flex h-36 w-full items-end rounded-t-lg bg-muted/40">
                  <div
                    className="w-full rounded-t-lg bg-primary/80 transition-all"
                    style={{ height: `${height}%` }}
                    title={`${point.date}: ${point[field]}`}
                  />
                </div>
                <span className="hidden text-[10px] text-muted-foreground sm:block">
                  {point.date.slice(5)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function AdminTables({
  data,
  onRetryComplete,
  toast,
}: {
  data: AdminDashboardData;
  onRetryComplete: () => void;
  toast: ReturnType<typeof useToast>["toast"];
}) {
  return (
    <div className="grid gap-6">
      <Card className="rounded-3xl border border-border bg-background/90 shadow-sm">
        <CardHeader className="space-y-2 px-6 pt-6">
          <CardTitle className="text-2xl">Recent activity</CardTitle>
          <CardDescription>
            Latest user, AI, failure, and notification events in one consolidated view.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <ActivitySection
            title="Newest users"
            rows={data.tables.newestUsers.map((user) => ({
              primary: `${user.firstName} ${user.lastName}`,
              secondary: `@${user.username} · ${user.email}`,
              meta: user.emailVerifiedAt ? "Verified" : "Unverified",
            }))}
          />
          <ActivitySection
            title="Recent AI jobs"
            rows={data.tables.recentAiJobs.map((job) => ({
              primary: job.type,
              secondary: `${job.provider} · ${(job.promptTokens ?? 0) + (job.completionTokens ?? 0)} tokens`,
              meta: job.status,
            }))}
          />
          <ActivitySection
            title="Recent failures"
            rows={data.tables.recentFailures.map((failure) => ({
              primary: failure.type,
              secondary: failure.errorMessage || "No error message captured",
              meta: new Date(failure.createdAt).toLocaleDateString(),
            }))}
          />
          <ActivitySection
            title="Recent notifications"
            rows={data.tables.recentNotifications.map((notification) => ({
              primary: notification.title,
              secondary: `${notification.type} · ${notification.user?.email ?? "Unknown user"}`,
              meta: notification.status,
            }))}
          />
        </CardContent>
      </Card>

      <Card className="rounded-3xl border border-border bg-background/90 shadow-sm">
        <CardHeader className="space-y-2 px-6 pt-6">
          <CardTitle className="text-2xl">Platform diagnostics</CardTitle>
          <CardDescription>
            Queue health, environment warnings, and schema diagnostics for operational visibility.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-6 pt-3">
          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-white/90 p-5 shadow-sm dark:bg-slate-950/80">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Queue details</p>
                  <p className="text-xs text-muted-foreground">Retry and monitoring information for background queues.</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-muted/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {data.monitoring.queueHealth.length} queues
                </span>
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {data.monitoring.queueHealth.map((queue) => (
                  <div key={queue.name} className="rounded-3xl border border-border bg-muted/5 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{queue.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{queue.healthy ? "Healthy" : "Needs review"}</p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]",
                          queue.healthy ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700"
                        )}
                      >
                        {queue.healthy ? "Healthy" : "Review"}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                      <QueueCount label="Waiting" value={queue.waiting} />
                      <QueueCount label="Active" value={queue.active} />
                      <QueueCount label="Done" value={queue.completed} />
                      <QueueCount label="Failed" value={queue.failed} />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                      <QueueCount label="Delayed" value={queue.delayed} />
                      <QueueCount label="Retries" value={queue.retryCount} />
                      <QueueCount label="Paused" value={queue.paused} />
                      <QueueCount label="Stuck" value={queue.stuck} />
                    </div>
                    {queue.recentFailures?.length ? (
                      <div className="mt-4 rounded-2xl bg-destructive/5 p-3 text-xs text-muted-foreground">
                        <p className="font-medium text-foreground">Latest failure</p>
                        <p className="mt-1 line-clamp-2">{queue.recentFailures[0].failedReason || "No failure reason captured"}</p>
                      </div>
                    ) : null}
                    <RetryQueueButton
                      queueName={queue.name}
                      disabled={queue.failed === 0}
                      onRetryComplete={onRetryComplete}
                      toast={toast}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <DetailCard
                title="Environment warnings"
                rows={data.monitoring.environment.warnings.map((warning) => ({
                  primary: warning,
                  secondary: `${data.monitoring.environment.nodeEnv} · ${data.monitoring.environment.storageProvider}`,
                }))}
                emptyText="No environment warnings"
              />
              <DetailCard
                title="Schema diagnostics"
                rows={(data.monitoring.database.schema?.missing ?? []).map((item) => ({
                  primary: item,
                  secondary: "Database schema is behind the Prisma schema. Apply migrations before production launch.",
                }))}
                emptyText="No schema issues detected"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ActivitySection({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ primary: string; secondary: string; meta: string }>;
}) {
  return (
    <div className="rounded-3xl border border-border bg-white/90 p-5 shadow-sm dark:bg-slate-950/80">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <span className="rounded-full bg-muted/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          {rows.length}
        </span>
      </div>
      <div className="space-y-3">
        {rows.length ? (
          rows.slice(0, 4).map((row, index) => (
            <div key={`${title}-${index}`} className="rounded-2xl border border-border bg-background/50 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground truncate">{row.primary}</p>
                <span className="rounded-full bg-muted/10 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  {row.meta}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{row.secondary}</p>
            </div>
          ))
        ) : (
          <EmptyText>No records yet.</EmptyText>
        )}
      </div>
    </div>
  );
}

function DetailCard({
  title,
  rows,
  emptyText,
}: {
  title: string;
  rows: Array<{ primary: string; secondary: string }>;
  emptyText: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-white/90 p-5 shadow-sm dark:bg-slate-950/80">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <div className="mt-4 space-y-3">
        {rows.length ? (
          rows.slice(0, 4).map((row, index) => (
            <div key={`${title}-${index}`} className="rounded-2xl border border-border bg-background/50 p-3">
              <p className="text-sm font-semibold text-foreground truncate">{row.primary}</p>
              <p className="mt-1 text-xs text-muted-foreground">{row.secondary}</p>
            </div>
          ))
        ) : (
          <EmptyText>{emptyText}</EmptyText>
        )}
      </div>
    </div>
  );
}

function RetryQueueButton({
  queueName,
  disabled,
  onRetryComplete,
  toast,
}: {
  queueName: string;
  disabled: boolean;
  onRetryComplete: () => void;
  toast: ReturnType<typeof useToast>["toast"];
}) {
  const mutation = useMutation({
    mutationFn: () => adminApi.retryFailedJobs(queueName),
    onSuccess: (result) => {
      toast({
        variant: "success",
        title: "Retry requested",
        description: `${result.retried} failed jobs moved back into ${queueName}.`,
      });
      onRetryComplete();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Retry failed",
        description: error?.message || "Could not retry failed queue jobs.",
      });
    },
  });

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="mt-4 w-full gap-2 rounded-xl"
      disabled={disabled || mutation.isPending}
      loading={mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      Retry failed jobs
    </Button>
  );
}

function TableCard({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ primary: string; secondary: string; meta: string }>;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.length ? (
          rows.map((row, index) => (
            <div
              key={`${title}-${index}`}
              className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background/40 p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{row.primary}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {row.secondary}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
                {row.meta}
              </span>
            </div>
          ))
        ) : (
          <EmptyText>No records yet.</EmptyText>
        )}
      </CardContent>
    </Card>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="capitalize text-muted-foreground">{label}</span>
        <span className="font-semibold">{formatNumber(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted/60">
        <div className="h-full rounded-full bg-primary" style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  );
}

function QueueCount({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-semibold text-foreground">{formatNumber(value)}</p>
      <p className="mt-1 truncate">{label}</p>
    </div>
  );
}

function EmptyText({ children }: { children: string }) {
  return <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">{children}</p>;
}

function formatNumber(value: number) {
  return Intl.NumberFormat("en", { notation: value > 9999 ? "compact" : "standard" }).format(value);
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}



