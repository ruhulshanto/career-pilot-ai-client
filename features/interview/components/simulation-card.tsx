"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bot,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Lightbulb,
  Loader2,
  LockKeyhole,
  MessageSquare,
  Play,
  RefreshCcw,
  Send,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { useToast } from "@/shared/hooks/use-toast";
import { useWorkspaceBase } from "@/shared/hooks/use-workspace-base";
import { getWorkspaceHref } from "@/shared/lib/role-routing";
import { cn } from "@/shared/lib/utils";
import { toast as sonnerToast } from "sonner";
import {
  interviewApi,
  type InterviewQuestion,
  type InterviewSession,
  type InterviewSlot,
} from "@/services/api/interview";

type InterviewSimulationCardProps = {
  activeSessionId: string | null;
  onSessionChange: (sessionId: string | null) => void;
  initialRole?: string;
  initialLevel?: string;
};

type FeedbackFocus = "all" | "strengths" | "weaknesses";
type FeedbackSort = "default" | "score-high" | "score-low";
type ScheduleMode = "now" | "slot";

const levelOptions = ["Entry", "Junior", "Mid", "Senior", "Lead"];
const feedbackFocusOptions: Array<{ value: FeedbackFocus; label: string }> = [
  { value: "all", label: "All" },
  { value: "strengths", label: "Strengths" },
  { value: "weaknesses", label: "Weaknesses" },
];
const feedbackSortOptions: Array<{ value: FeedbackSort; label: string }> = [
  { value: "default", label: "Question order" },
  { value: "score-high", label: "Highest score" },
  { value: "score-low", label: "Lowest score" },
];

const statusText: Record<InterviewSession["status"], string> = {
  SCHEDULED: "Scheduled",
  ACTIVE: "Practice in progress",
  IN_PROGRESS: "Practice in progress",
  COMPLETED: "Feedback ready",
  CANCELLED: "Cancelled",
};
const SLOT_START_BUFFER_MS = 5 * 60 * 1000;

const formatError = (error: unknown) =>
  error && typeof error === "object" && "message" in error
    ? String((error as { message?: unknown }).message)
    : "Something went wrong. Please try again.";

const formatScheduledAt = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("en", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(value))
    : null;

const formatSlotDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("en", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(value))
    : null;

const formatSlotTime = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("en", {
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      }).format(new Date(value))
    : null;

const getLocalTimeZone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time";

const formatLocalDateParam = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatSlotLabel = (value: string) =>
  new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export function InterviewSimulationCard({
  activeSessionId,
  onSessionChange,
  initialRole,
  initialLevel,
}: InterviewSimulationCardProps) {
  const workspaceBase = useWorkspaceBase();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const bookingToastIdRef = useRef<string | number | null>(null);
  const [roleTarget, setRoleTarget] = useState(
    initialRole || "Frontend Developer",
  );
  const [level, setLevel] = useState(initialLevel || "Junior");
  const [questionCount, setQuestionCount] = useState(5);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedbackQueued, setFeedbackQueued] = useState(false);
  const [feedbackFocus, setFeedbackFocus] = useState<FeedbackFocus>("all");
  const [feedbackSort, setFeedbackSort] = useState<FeedbackSort>("default");
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>("now");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [pendingSlot, setPendingSlot] = useState<InterviewSlot | null>(null);
  const [nowMs, setNowMs] = useState(Date.now());

  const activeQuery = useQuery({
    queryKey: ["interview-session", activeSessionId],
    queryFn: () => interviewApi.getSession(activeSessionId as string),
    enabled: Boolean(activeSessionId),
    refetchInterval: (query) => {
      const session = query.state.data as InterviewSession | undefined;
      if (!session || session.status === "COMPLETED") return false;
      const scheduledForFuture =
        session.scheduledAt && new Date(session.scheduledAt).getTime() > Date.now();
      if (scheduledForFuture && session.questions?.length) return false;
      return 2500;
    },
  });

  const session = activeQuery.data;
  const questions = session?.questions ?? [];
  const feedback = session?.aiFeedbacks?.[0];
  const scheduledAtLabel = formatScheduledAt(session?.scheduledAt);
  const scheduledAtMs = session?.scheduledAt
    ? new Date(session.scheduledAt).getTime()
    : null;
  const isScheduledForFuture = Boolean(
    scheduledAtMs &&
      scheduledAtMs > nowMs &&
      session?.status === "SCHEDULED",
  );
  const perQuestionFeedback = feedback?.questionFeedback ?? [];
  const isGeneratingQuestions =
    Boolean(activeSessionId) && questions.length === 0 && !feedback;
  const isGeneratingFeedback =
    Boolean(session) &&
    questions.length > 0 &&
    session?.status !== "COMPLETED" &&
    questions.some((question) => question.answer);
  const canPracticeNow = !isScheduledForFuture;

  const slotsQuery = useQuery({
    queryKey: ["interview-slots", roleTarget.trim(), level],
    queryFn: () =>
      interviewApi.getSlots({
        date: formatLocalDateParam(),
        days: 7,
        roleTarget: roleTarget.trim(),
        level,
        timezoneOffsetMinutes: new Date().getTimezoneOffset(),
        now: new Date().toISOString(),
      }),
    enabled: roleTarget.trim().length >= 2,
    staleTime: 60_000,
    retry: 1,
  });
  const availableSlots = useMemo(
    () =>
      (slotsQuery.data ?? [])
        .filter(
          (slot) =>
            slot.available &&
            new Date(slot.startsAt).getTime() > nowMs + SLOT_START_BUFFER_MS,
        )
        .slice(0, 10),
    [nowMs, slotsQuery.data],
  );
  const selectedSlotLabel = formatScheduledAt(selectedSlot ?? undefined);
  const pendingSlotDate = formatSlotDate(pendingSlot?.startsAt);
  const pendingSlotStart = formatSlotTime(pendingSlot?.startsAt);
  const pendingSlotEnd = formatSlotTime(pendingSlot?.endsAt);
  const localTimeZone = getLocalTimeZone();

  const allAnswersReady = useMemo(
    () =>
      questions.length > 0 &&
      questions.every(
        (question) => (answers[question.questionId] ?? "").trim().length >= 5,
      ),
    [answers, questions],
  );

  const visibleQuestionFeedback = useMemo(() => {
    const items = questions.map((question, index) => {
      const item = perQuestionFeedback.find(
        (entry) => entry.questionId === question.questionId,
      );
      return {
        index,
        question,
        feedback: item,
        score: item?.score ?? 0,
        hasStrengths: Boolean(item?.whatWorked?.length),
        hasWeaknesses: Boolean(item?.improve?.length),
      };
    });

    const filtered = items.filter((item) => {
      if (feedbackFocus === "strengths") return item.hasStrengths;
      if (feedbackFocus === "weaknesses") return item.hasWeaknesses;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (feedbackSort === "score-high") return b.score - a.score;
      if (feedbackSort === "score-low") return a.score - b.score;
      return a.index - b.index;
    });
  }, [feedbackFocus, feedbackSort, perQuestionFeedback, questions]);

  useEffect(() => {
    if (!questions.length) return;
    setAnswers((current) => {
      const next = { ...current };
      for (const question of questions) {
        if (next[question.questionId] === undefined) {
          next[question.questionId] = question.answer ?? "";
        }
      }
      return next;
    });
  }, [questions]);

  useEffect(() => {
    if (initialRole) {
      setRoleTarget(initialRole);
    }
  }, [initialRole]);

  useEffect(() => {
    if (initialLevel) {
      setLevel(initialLevel);
    }
  }, [initialLevel]);

  useEffect(() => {
    if (feedback) {
      setFeedbackQueued(false);
    }
  }, [feedback]);

  useEffect(() => {
    if (scheduleMode === "now") {
      setPendingSlot(null);
    }
  }, [scheduleMode]);

  useEffect(() => {
    if (scheduleMode !== "slot") return;
    const intervalId = window.setInterval(() => setNowMs(Date.now()), 30_000);
    return () => window.clearInterval(intervalId);
  }, [scheduleMode]);

  useEffect(() => {
    setSelectedSlot(null);
    setPendingSlot(null);
  }, [roleTarget, level]);

  useEffect(() => {
    if (!selectedSlot) return;
    if (new Date(selectedSlot).getTime() <= nowMs + SLOT_START_BUFFER_MS) {
      setSelectedSlot(null);
    }
  }, [nowMs, selectedSlot]);

  useEffect(() => {
    if (!pendingSlot) return;
    if (new Date(pendingSlot.startsAt).getTime() <= nowMs + SLOT_START_BUFFER_MS) {
      setPendingSlot(null);
    }
  }, [nowMs, pendingSlot]);

  useEffect(() => {
    if (!isScheduledForFuture) return;
    const intervalId = window.setInterval(() => setNowMs(Date.now()), 30_000);
    return () => window.clearInterval(intervalId);
  }, [isScheduledForFuture]);

  useEffect(() => {
    if (!scheduledAtMs || scheduledAtMs <= Date.now() || !activeSessionId) return;

    const timeoutId = window.setTimeout(() => {
      setNowMs(Date.now());
      void queryClient.invalidateQueries({
        queryKey: ["interview-session", activeSessionId],
      });
      void queryClient.invalidateQueries({ queryKey: ["interviews"] });
    }, scheduledAtMs - Date.now() + 1000);

    return () => window.clearTimeout(timeoutId);
  }, [activeSessionId, queryClient, scheduledAtMs]);

  useEffect(() => {
    if (!pendingSlot) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPendingSlot(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pendingSlot]);

  const startMutation = useMutation({
    mutationFn: (scheduledAtOverride?: string) =>
      interviewApi.startSession({
        title: `${roleTarget} Mock Interview`,
        roleTarget,
        level,
        questionCount,
        scheduledAt:
          scheduledAtOverride ??
          (scheduleMode === "slot" ? selectedSlot ?? undefined : undefined),
      }),
    onSuccess: async (createdSession) => {
      setAnswers({});
      setFeedbackQueued(false);
      setFeedbackFocus("all");
      setFeedbackSort("default");
      onSessionChange(createdSession.id);
      await queryClient.invalidateQueries({ queryKey: ["interviews"] });
      await queryClient.invalidateQueries({ queryKey: ["interview-slots"] });
      await queryClient.invalidateQueries({ queryKey: ["career-context"] });
      const wasScheduled = Boolean(createdSession.scheduledAt);
      if (bookingToastIdRef.current) {
        sonnerToast.dismiss(bookingToastIdRef.current);
        bookingToastIdRef.current = null;
      }
      if (wasScheduled) {
        sonnerToast.success("Interview scheduled", {
          description: `Booked for ${formatScheduledAt(
            createdSession.scheduledAt,
          )}. You can remove it from Scheduled interviews if needed.`,
        });
      }
      toast({
        variant: wasScheduled ? "success" : "default",
        title: wasScheduled ? "Interview scheduled" : "Interview started",
        description:
          wasScheduled
            ? `Booked for ${formatScheduledAt(
                createdSession.scheduledAt,
              )}. Questions are prepared early; answering unlocks at the scheduled time. Next: watch the countdown in Interview History or return when the slot begins.`
            : "AI question generation is now in progress.",
      });
    },
    onError: (error) => {
      if (bookingToastIdRef.current) {
        sonnerToast.dismiss(bookingToastIdRef.current);
        bookingToastIdRef.current = null;
      }
      sonnerToast.error("Could not book schedule", {
        description: formatError(error),
      });
      toast({
        title: "Could not start interview",
        description: formatError(error),
        variant: "destructive",
      });
    },
  });

  const submitMutation = useMutation({
    mutationFn: () =>
      interviewApi.submitAnswers(activeSessionId as string, {
        answers: questions.map((question) => ({
          questionId: question.questionId,
          answer: answers[question.questionId].trim(),
        })),
        transcript: questions
          .map(
            (question) =>
              `${question.prompt}\n${answers[question.questionId].trim()}`,
          )
          .join("\n\n"),
    }),
    onMutate: () => {
      setFeedbackQueued(true);
      setFeedbackFocus("all");
      setFeedbackSort("default");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["interview-session", activeSessionId],
      });
      await queryClient.invalidateQueries({ queryKey: ["interviews"] });
      await queryClient.invalidateQueries({ queryKey: ["career-context"] });
      toast({
        title: "Answers submitted",
        description: "AI feedback is being generated.",
      });
    },
    onError: (error) => {
      setFeedbackQueued(false);
      toast({
        title: "Could not submit answers",
        description: formatError(error),
        variant: "destructive",
      });
    },
  });

  const startNewInterview = () => {
    onSessionChange(null);
    setAnswers({});
    setFeedbackQueued(false);
    setFeedbackFocus("all");
    setFeedbackSort("default");
  };

  const isWaitingForFeedback =
    submitMutationIsBusy(submitMutation.isPending, feedbackQueued) ||
    isGeneratingFeedback;

  const confirmPendingSlot = () => {
    if (!pendingSlot) return;
    const slotStartsAt = pendingSlot.startsAt;
    if (new Date(slotStartsAt).getTime() <= Date.now() + SLOT_START_BUFFER_MS) {
      toast({
        variant: "destructive",
        title: "Slot is no longer available",
        description: "Please choose a future interview slot.",
      });
      setPendingSlot(null);
      void queryClient.invalidateQueries({ queryKey: ["interview-slots"] });
      return;
    }
    setSelectedSlot(slotStartsAt);
    setPendingSlot(null);
    setScheduleMode("slot");
    bookingToastIdRef.current = sonnerToast.loading("Booking interview slot...", {
      description: `Reserving ${formatScheduledAt(slotStartsAt)}.`,
    });
    startMutation.mutate(slotStartsAt);
  };

  const handleScheduleModeChange = (mode: ScheduleMode) => {
    setScheduleMode(mode);
    setNowMs(Date.now());
    if (mode === "slot") {
      void slotsQuery.refetch();
    }
  };

  const handleSlotClick = (slot: InterviewSlot) => {
    const currentNow = Date.now();
    setNowMs(currentNow);
    if (new Date(slot.startsAt).getTime() <= currentNow + SLOT_START_BUFFER_MS) {
      toast({
        variant: "destructive",
        title: "Slot is no longer available",
        description: "Please choose a future interview slot.",
      });
      void queryClient.invalidateQueries({ queryKey: ["interview-slots"] });
      return;
    }
    setPendingSlot(slot);
  };

  return (
    <Card className="lg:col-span-2 h-full border border-border shadow-sm">
      <CardContent className="space-y-8 p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-primary">
              <Bot className="h-6 w-6" />
              <p className="text-xs font-semibold uppercase tracking-[0.24em]">
                AI Mock Interview
              </p>
            </div>
            <h2 className="text-2xl font-semibold text-foreground">
              Practice for a real role
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Generate personalized questions, answer them in writing, and get
              focused feedback on strengths, gaps, and next practice steps.
            </p>
          </div>

          {session ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {statusText[session.status]}
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 rounded-2xl border border-border bg-card/70 p-4 lg:grid-cols-[1.4fr_0.8fr_0.5fr_auto]">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Target role
            </label>
            <Input
              value={roleTarget}
              onChange={(event) => setRoleTarget(event.target.value)}
              placeholder="Data Analyst, React Developer..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Level
            </label>
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              className="flex h-12 w-full rounded-xl border border-border/60 bg-muted/40 px-4 text-sm text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            >
              {levelOptions.map((option) => (
                <option key={option} value={option} className="bg-card">
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Questions
            </label>
            <Input
              type="number"
              min={1}
              max={12}
              value={questionCount}
              onChange={(event) =>
                setQuestionCount(
                  Math.min(12, Math.max(1, Number(event.target.value) || 1)),
                )
              }
            />
          </div>

          <div className="flex flex-col justify-end gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button
              onClick={() => startMutation.mutate(undefined)}
              disabled={
                roleTarget.trim().length < 2 ||
                startMutation.isPending ||
                (scheduleMode === "slot" && !selectedSlot)
              }
              loading={startMutation.isPending}
              className={cn(
                "h-14 w-full px-5 text-sm font-semibold shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 lg:h-12 lg:w-auto",
                scheduleMode === "now" &&
                  "bg-accent text-accent-foreground shadow-elevation/5 hover:bg-accent/90",
              )}
            >
              <Play className="h-4 w-4" />
              {scheduleMode === "slot" ? "Schedule" : "Start Now"}
            </Button>
            {session ? (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={startNewInterview}
                aria-label="Start a fresh interview"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-border bg-card/70 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Available Interview Slots
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Practice right away or reserve a slot matched to this role and
                level.
              </p>
            </div>
            <div className="flex w-full rounded-2xl border border-border/60 bg-muted/35 p-1 sm:w-auto">
              {[
                { value: "now", label: "Start now" },
                { value: "slot", label: "Schedule" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleScheduleModeChange(option.value as ScheduleMode)}
                    className={cn(
                    "flex-1 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 active:scale-[0.98] sm:flex-none",
                    scheduleMode === option.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {scheduleMode === "slot" ? (
            <div className="space-y-3">
              {slotsQuery.isLoading ? (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Loading available slots...
                </div>
              ) : slotsQuery.isError ? (
                <div className="flex flex-col gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    Could not load interview slots. Please retry, or use Start Now
                    for immediate practice.
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full rounded-2xl sm:w-auto"
                    onClick={() => slotsQuery.refetch()}
                  >
                    Retry slots
                  </Button>
                </div>
              ) : availableSlots.length ? (
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
                  {availableSlots.map((slot: InterviewSlot) => (
                    <button
                      key={slot.startsAt}
                      onClick={() => handleSlotClick(slot)}
                      className={cn(
                        "min-h-20 rounded-2xl border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-elevation/10 active:translate-y-0 active:scale-[0.99]",
                        selectedSlot === slot.startsAt
                          ? "border-primary bg-primary/15 text-foreground"
                          : "border-border/60 bg-muted/40 text-muted-foreground hover:border-primary/30 hover:text-foreground",
                      )}
                    >
                      <Clock3 className="mb-2 h-4 w-4 text-primary" />
                      <span className="block text-xs font-semibold leading-5">
                        {formatSlotLabel(slot.startsAt)}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No open interview slots are available this week.
                </p>
              )}
              {selectedSlotLabel ? (
                <div className="flex flex-col gap-2 rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    Selected slot:{" "}
                    <strong className="font-semibold">{selectedSlotLabel}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedSlot(null)}
                    className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-primary sm:text-right"
                  >
                    Change
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {activeQuery.error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Interview Error</AlertTitle>
            <AlertDescription>{formatError(activeQuery.error)}</AlertDescription>
          </Alert>
        ) : null}

        {isGeneratingQuestions ? (
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Generating role-specific interview questions...
          </div>
        ) : null}

        {questions.length > 0 ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {session?.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isScheduledForFuture
                    ? "Your questions are ready, but hidden until the scheduled start time."
                    : "Answer each question with a specific example and measurable outcome where possible."}
                </p>
              </div>
              {isWaitingForFeedback ? (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {submitMutation.isPending
                    ? "Submitting answers"
                    : "Generating feedback"}
                </div>
              ) : null}
            </div>

            {scheduledAtLabel ? (
              <div
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-4 text-sm",
                  isScheduledForFuture
                    ? "border-primary/20 bg-primary/10 text-foreground"
                    : "border-accent/20 bg-accent/10 text-accent",
                )}
              >
                <CalendarClock className="h-5 w-5 shrink-0 text-primary" />
                <span>
                  {isScheduledForFuture
                    ? `Scheduled for ${scheduledAtLabel}. Questions are prepared early; answering unlocks at the scheduled time.`
                    : `Scheduled slot reached: ${scheduledAtLabel}. You can take the practice now.`}
                </span>
              </div>
            ) : null}

            {isWaitingForFeedback ? (
              <div className="overflow-hidden rounded-2xl border border-primary/20 bg-primary/10">
                <div className="flex items-center gap-3 px-5 py-4 text-sm text-foreground">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  <span>
                    {submitMutation.isPending
                      ? "Submitting your answers..."
                      : "CareerAI is reading your answers and preparing per-question mentoring notes."}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-muted/40">
                  <div className="h-full w-2/3 animate-pulse rounded-r-full bg-primary" />
                </div>
              </div>
            ) : null}

            {isScheduledForFuture ? (
              <div className="rounded-3xl border border-primary/20 bg-primary/10 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/15 text-primary">
                    <LockKeyhole className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      Questions are locked until your scheduled time
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      CareerAI prepared {questions.length} questions early so
                      your interview can start on time. The prompts and answer
                      boxes will appear automatically when the slot begins.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question: InterviewQuestion, index) => (
                  <div
                    key={question.questionId}
                    className="rounded-2xl border border-border bg-card/70 p-5"
                  >
                    <div className="mb-4 flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                        {index + 1}
                      </span>
                      <p className="text-sm font-medium leading-6 text-foreground">
                        {question.prompt}
                      </p>
                    </div>
                    <textarea
                      value={answers[question.questionId] ?? ""}
                      onChange={(event) =>
                        setAnswers((current) => ({
                          ...current,
                          [question.questionId]: event.target.value,
                        }))
                      }
                      disabled={
                        session?.status === "COMPLETED" ||
                        isWaitingForFeedback ||
                        !canPracticeNow
                      }
                      placeholder="Write your answer with context, action, and impact..."
                      className="min-h-28 w-full resize-y rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 text-sm leading-6 text-foreground outline-none transition-all placeholder:text-foreground/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                ))}
              </div>
            )}

            {!isScheduledForFuture && feedback ? (
              <div className="space-y-5 rounded-3xl border border-primary/20 bg-primary/10 p-5 shadow-xl shadow-elevation/10">
                <div className="grid gap-5 lg:grid-cols-[1fr_180px]">
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                          AI Feedback
                        </p>
                        <h3 className="text-xl font-semibold text-foreground">
                          Practice review complete
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm leading-7 text-foreground/85">
                      {feedback.summary}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-border/60 bg-muted/40 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-muted-foreground">
                        Score
                      </span>
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="mt-4 text-4xl font-semibold text-foreground">
                      {Math.round(feedback.score ?? session?.score ?? 0)}
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted/60">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(feedback.score ?? session?.score ?? 0, 100),
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <FeedbackList title="Strengths" items={feedback.strengths ?? []} />
                  <FeedbackList title="Gaps" items={feedback.weaknesses ?? []} />
                  <FeedbackList title="Next Actions" items={feedback.suggestions ?? []} />
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      <h4 className="text-base font-semibold text-foreground">
                        Per-question mentoring
                      </h4>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="flex rounded-2xl border border-border/60 bg-muted/35 p-1">
                        {feedbackFocusOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setFeedbackFocus(option.value)}
                            className={cn(
                              "rounded-xl px-3 py-2 text-xs font-semibold transition-colors",
                              feedbackFocus === option.value
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      <select
                        value={feedbackSort}
                        onChange={(event) =>
                          setFeedbackSort(event.target.value as FeedbackSort)
                        }
                        className="h-10 rounded-2xl border border-border/60 bg-muted/35 px-3 text-xs font-semibold text-foreground outline-none focus:border-primary/40"
                      >
                        {feedbackSortOptions.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            className="bg-card"
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {visibleQuestionFeedback.length ? (
                      visibleQuestionFeedback.map((item) => (
                        <QuestionFeedbackCard
                          key={item.question.questionId}
                          index={item.index}
                          question={item.question}
                          feedback={item.feedback}
                          focus={feedbackFocus}
                        />
                      ))
                    ) : (
                      <div className="rounded-2xl border border-border/60 bg-muted/35 p-4 text-sm text-muted-foreground">
                        No feedback matched this filter.
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 rounded-2xl border border-border/60 bg-muted/40 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Next: Continue the conversation
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Ask the career assistant to turn this feedback into a
                      short practice plan.
                    </p>
                  </div>
                  <Button asChild variant="outline" className="w-full sm:w-auto">
                    <Link href={getWorkspaceHref(workspaceBase, "chat")}>
                      <MessageSquare className="h-4 w-4" />
                      Open AI Assistant
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : !isScheduledForFuture ? (
              <Button
                onClick={() => submitMutation.mutate()}
                disabled={
                  !allAnswersReady ||
                  !canPracticeNow ||
                  submitMutation.isPending ||
                  feedbackQueued ||
                  session?.status === "COMPLETED"
                }
                loading={submitMutation.isPending}
                className={cn("w-full sm:w-auto", !allAnswersReady && "opacity-60")}
              >
                <Send className="h-4 w-4" />
                {submitMutation.isPending ? "Submitting" : "Submit Answers"}
              </Button>
            ) : null}
          </div>
        ) : null}
      </CardContent>

      {pendingSlot ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="slot-confirmation-title"
          onClick={() => setPendingSlot(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl shadow-elevation/20"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div>
                <h3
                  id="slot-confirmation-title"
                  className="text-lg font-semibold text-foreground"
                >
                  Confirm interview slot
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Review the role, level, and local time before reserving this
                  mock interview.
                </p>
              </div>
            </div>
            <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/40 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Slot
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {pendingSlotDate}
                </p>
                <p className="mt-1 text-sm text-foreground/80">
                  {pendingSlotStart} - {pendingSlotEnd}
                </p>
              </div>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-xl bg-muted/40 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Role
                  </p>
                  <p className="mt-1 break-words font-medium text-foreground">
                    {roleTarget}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/40 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Level
                  </p>
                  <p className="mt-1 font-medium text-foreground">{level}</p>
                </div>
              </div>
              <p className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-xs leading-5 text-primary">
                Time zone: {localTimeZone}. The interview unlocks at this local
                time.
              </p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full"
                disabled={startMutation.isPending}
                onClick={() => setPendingSlot(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="h-11 w-full"
                loading={startMutation.isPending}
                disabled={startMutation.isPending}
                onClick={confirmPendingSlot}
              >
                {startMutation.isPending ? "Booking" : "Confirm & Schedule"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

const submitMutationIsBusy = (isPending: boolean, isQueued: boolean) =>
  isPending || isQueued;

function FeedbackList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/35 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </p>
      <ul className="space-y-2 text-sm leading-6 text-foreground/80">
        {items.length ? (
          items.map((item) => (
            <li key={item} className="rounded-xl bg-muted/40 p-3">
              {item}
            </li>
          ))
        ) : (
          <li className="rounded-xl bg-muted/40 p-3">
            No feedback returned for this area.
          </li>
        )}
      </ul>
    </div>
  );
}

function QuestionFeedbackCard({
  index,
  question,
  feedback,
  focus,
}: {
  index: number;
  question: InterviewQuestion;
  feedback?: {
    score: number;
    whatWorked: string[];
    improve: string[];
    strongerAnswer: string;
  };
  focus: FeedbackFocus;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/35 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Question {index + 1}
          </p>
          <p className="mt-2 text-sm font-medium leading-6 text-foreground">
            {question.prompt}
          </p>
        </div>
        <span className="w-fit rounded-xl border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          {Math.round(feedback?.score ?? 0)}/100
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {focus !== "weaknesses" ? (
          <MiniFeedback title="What worked" items={feedback?.whatWorked ?? []} />
        ) : null}
        {focus !== "strengths" ? (
          <MiniFeedback title="Improve" items={feedback?.improve ?? []} />
        ) : null}
        <div
          className={cn(
            "rounded-xl bg-muted/40 p-3",
            focus !== "all" && "lg:col-span-2",
          )}
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Stronger answer
          </p>
          <p className="text-sm leading-6 text-foreground/80">
            {feedback?.strongerAnswer ??
              "Add a clearer example, the action you took, and the result."}
          </p>
        </div>
      </div>
    </div>
  );
}

function MiniFeedback({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl bg-muted/40 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </p>
      <ul className="space-y-2 text-sm leading-6 text-foreground/80">
        {items.length ? (
          items.map((item) => <li key={item}>{item}</li>)
        ) : (
          <li>More detail needed here.</li>
        )}
      </ul>
    </div>
  );
}
