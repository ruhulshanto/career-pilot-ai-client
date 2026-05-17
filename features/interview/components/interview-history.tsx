"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  History,
  Loader2,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import {
  interviewApi,
  type InterviewSession,
} from "@/services/api/interview";
import { useToast } from "@/shared/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { TableLoading } from "@/shared/components/loading/loading-system";

type InterviewHistoryProps = {
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));

const formatScheduledAt = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(value))
    : null;

const formatCountdown = (scheduledAt?: string, nowMs = Date.now()) => {
  if (!scheduledAt) return null;

  const remainingMs = new Date(scheduledAt).getTime() - nowMs;
  if (remainingMs <= 0) return "Starting now";

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s remaining`;
  return `${minutes}m ${seconds}s remaining`;
};

const getCountdownProgress = (session: InterviewSession, nowMs: number) => {
  if (!session.scheduledAt) return 0;
  const scheduledMs = new Date(session.scheduledAt).getTime();
  const createdMs = new Date(session.createdAt).getTime();
  const totalMs = Math.max(scheduledMs - createdMs, 1);
  const elapsedMs = Math.max(0, Math.min(nowMs - createdMs, totalMs));
  return Math.round((elapsedMs / totalMs) * 100);
};

const isFutureScheduled = (session: InterviewSession, nowMs: number) =>
  session.status === "SCHEDULED" &&
  Boolean(session.scheduledAt) &&
  new Date(session.scheduledAt as string).getTime() > nowMs;

const getScoreLabel = (session: InterviewSession) => {
  if (session.score !== undefined && session.score !== null) {
    return `${Math.round(session.score)}/100`;
  }
  if (session.status === "SCHEDULED") {
    return "Scheduled";
  }
  if (session.status === "COMPLETED") {
    return "Reviewed";
  }
  if (session.questions?.length) {
    return "Ready";
  }
  return "Queued";
};

export function InterviewHistory({
  activeSessionId,
  onSelectSession,
}: InterviewHistoryProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [nowMs, setNowMs] = useState(Date.now());
  const historyQuery = useQuery({
    queryKey: ["interviews"],
    queryFn: () => interviewApi.getHistory({ limit: 8 }),
    refetchInterval: 5000,
  });

  const sessions = historyQuery.data?.data ?? [];
  const scheduledSessions = sessions.filter((session) =>
    isFutureScheduled(session, nowMs),
  );
  const historySessions = sessions.filter(
    (session) => !isFutureScheduled(session, nowMs),
  );
  const hasFutureScheduledSessions = sessions.some((session) =>
    isFutureScheduled(session, nowMs),
  );
  const cancelMutation = useMutation({
    mutationFn: interviewApi.cancelScheduled,
    onMutate: () =>
      sonnerToast.loading("Deleting schedule...", {
        description: "Removing your interview booking.",
      }),
    onSuccess: async (_data, _variables, toastId) => {
      if (toastId) {
        sonnerToast.dismiss(toastId);
      }
      await queryClient.invalidateQueries({ queryKey: ["interviews"] });
      await queryClient.invalidateQueries({ queryKey: ["interview-slots"] });
      await queryClient.invalidateQueries({ queryKey: ["career-context"] });
      sonnerToast.success("Schedule deleted", {
        description: "Your interview booking was removed and the slot is available again.",
      });
      toast({
        variant: "success",
        title: "Schedule removed",
        description: "Your interview booking was cancelled and the slot is available again.",
      });
    },
    onError: (error: { message?: string }, _variables, toastId) => {
      if (toastId) {
        sonnerToast.dismiss(toastId);
      }
      sonnerToast.error("Could not delete schedule", {
        description: error.message || "Please try again.",
      });
      toast({
        variant: "destructive",
        title: "Could not remove schedule",
        description: error.message || "Please try again.",
      });
    },
  });

  useEffect(() => {
    if (!hasFutureScheduledSessions) return;
    const intervalId = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, [hasFutureScheduledSessions]);

  if (historyQuery.isLoading) {
    return <TableLoading rows={3} columns={2} />;
  }

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="flex-row items-center gap-3 border-b border-border/70 px-6 py-5">
        <History className="h-5 w-5 text-primary" />
        <CardTitle className="text-lg font-semibold text-foreground">
          Interview History
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 p-6 xl:grid-cols-[1fr_0.95fr]">
        {sessions.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-5 text-sm leading-6 text-muted-foreground xl:col-span-2">
            Your generated interviews will appear here after you start practice.
          </div>
        ) : null}

        {sessions.length ? (
          <>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Recent sessions
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Completed, active, and previously scheduled interviews.
                </p>
              </div>
              {historySessions.length ? (
                historySessions.map((item) => (
                  <InterviewHistoryItem
                    key={item.id}
                    item={item}
                    nowMs={nowMs}
                    activeSessionId={activeSessionId}
                    onSelectSession={onSelectSession}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
                  Your completed and active sessions will appear here.
                </div>
              )}
            </div>

            <div className="space-y-4 rounded-3xl border border-accent/20 bg-accent/[0.055] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent">
                  <CalendarCheck2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Scheduled interviews
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Confirmed bookings with live time remaining.
                  </p>
                </div>
              </div>

              {scheduledSessions.length ? (
                scheduledSessions.map((item) => (
                  <ScheduledInterviewCard
                    key={item.id}
                    item={item}
                    nowMs={nowMs}
                    activeSessionId={activeSessionId}
                    onSelectSession={onSelectSession}
                    isCancelling={cancelMutation.variables === item.id}
                    onCancel={() => cancelMutation.mutate(item.id)}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-border/60 bg-muted/35 p-4 text-sm leading-6 text-muted-foreground">
                  No confirmed scheduled interviews yet. Choose a slot above and
                  confirm it to see it here.
                </div>
              )}
            </div>
          </>
        ) : null}

        {historyQuery.isError ? (
          <Button
            variant="outline"
            className="w-full xl:col-span-2"
            onClick={() => historyQuery.refetch()}
          >
            Retry history
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

function InterviewHistoryItem({
  item,
  nowMs,
  activeSessionId,
  onSelectSession,
}: {
  item: InterviewSession;
  nowMs: number;
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
}) {
  return (
    <button
      onClick={() => onSelectSession(item.id)}
      className={cn(
        "w-full rounded-2xl border bg-card p-5 text-left transition-all hover:border-primary/30 hover:bg-muted/40",
        activeSessionId === item.id
          ? "border-primary/40 bg-primary/10"
          : "border-border",
      )}
    >
      <p className="truncate text-base font-semibold text-foreground">
        {item.roleTarget}
      </p>
      <p className="mt-1 truncate text-xs text-muted-foreground">
        {item.level ?? "General"} level
      </p>
      {item.scheduledAt ? (
        <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarClock className="h-3.5 w-3.5 text-primary" />
          Scheduled {formatScheduledAt(item.scheduledAt)}
        </p>
      ) : null}
      {isFutureScheduled(item, nowMs) ? (
        <CountdownBlock item={item} nowMs={nowMs} />
      ) : null}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          {getScoreLabel(item)}
        </span>
        <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {formatDate(item.updatedAt)}
        </span>
      </div>
    </button>
  );
}

function ScheduledInterviewCard({
  item,
  nowMs,
  activeSessionId,
  onSelectSession,
  isCancelling,
  onCancel,
}: {
  item: InterviewSession;
  nowMs: number;
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  isCancelling: boolean;
  onCancel: () => void;
}) {
  return (
    <div
      className={cn(
        "group w-full rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:border-accent/35 hover:bg-accent/10",
        activeSessionId === item.id
          ? "border-accent/45 bg-accent/10"
          : "border-border/60 bg-muted/35",
      )}
    >
      <button
        type="button"
        onClick={() => onSelectSession(item.id)}
        className="w-full text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Confirmed
            </div>
            <p className="truncate text-sm font-semibold text-foreground">
              {item.roleTarget}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {item.level ?? "General"} level
            </p>
          </div>
          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-accent" />
        </div>

        <div className="mt-4 rounded-2xl border border-border/60 bg-muted/40 p-3">
          <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <CalendarClock className="h-3.5 w-3.5 text-accent" />
            {formatScheduledAt(item.scheduledAt)}
          </p>
          <CountdownBlock item={item} nowMs={nowMs} compact />
        </div>
      </button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3 h-10 w-full rounded-2xl border-destructive/20 text-destructive hover:text-destructive"
        loading={isCancelling}
        disabled={isCancelling}
        onClick={onCancel}
      >
        {!isCancelling && <Trash2 className="h-4 w-4" />}
        Remove schedule
      </Button>
    </div>
  );
}

function CountdownBlock({
  item,
  nowMs,
  compact,
}: {
  item: InterviewSession;
  nowMs: number;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-primary/20 bg-primary/10",
        compact ? "mt-3 p-0 border-0 bg-transparent" : "mt-3 p-3",
      )}
      title={`Starts ${formatScheduledAt(item.scheduledAt)}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        {!compact ? (
          <span className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Scheduled
          </span>
        ) : null}
        <span className="rounded-xl bg-muted/40 px-3 py-1 text-xs font-semibold text-primary">
          {formatCountdown(item.scheduledAt, nowMs)}
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted/50">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${getCountdownProgress(item, nowMs)}%` }}
        />
      </div>
    </div>
  );
}
