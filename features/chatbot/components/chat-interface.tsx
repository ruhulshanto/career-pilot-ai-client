"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Send,
  User,
  Bot,
  Loader2,
  ShieldAlert,
  Clock3,
  RefreshCw,
} from "lucide-react";
import { CareerPilotTrajectoryIcon } from "@/shared/components/icons/CareerPilotTrajectoryIcon";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useChatbotStore } from "@/shared/store/use-chatbot-store";
import { useChatbotStream } from "@/shared/hooks/use-chatbot-stream";

const POST_RETRY_LOCK_MS = 15 * 1000;

export const ChatInterface = ({ sessionId }: { sessionId: string }) => {
  const { messages, sessions, sendMessage, isStreaming } = useChatbotStore();
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useChatbotStream(sessionId);

  const sessionMessages = useMemo(
    () => messages[sessionId] || [],
    [messages, sessionId],
  );
  const activeSession = useMemo(
    () => sessions.find((session) => session.id === sessionId),
    [sessions, sessionId],
  );
  const userProfile = activeSession?.context?.userProfile;
  const careerContext = activeSession?.context?.careerContext as
    | {
        resume?: {
          inferredTargetRole?: string;
          missingSkills?: string[];
          keywordGaps?: string[];
          improvementSuggestions?: string[];
        };
        roadmap?: {
          targetRole?: string;
          currentLevel?: string;
          nextMilestone?: string;
          activeMilestone?: string;
          skillsToBuild?: string[];
        };
        interview?: { weakestQuestions?: string[]; suggestedPracticeAreas?: string[] };
        nextAction?: { label?: string };
      }
    | undefined;
  const rawRole =
    (careerContext?.roadmap?.targetRole ||
      careerContext?.resume?.inferredTargetRole ||
      (typeof userProfile?.role === "string" ? userProfile.role : "")
    ).trim();
  const rawLevel =
    (careerContext?.roadmap?.currentLevel ||
      (typeof userProfile?.level === "string" ? userProfile.level : "")
    ).trim();
  const roleLabel =
    rawRole && !["career growth", "general"].includes(rawRole.toLowerCase())
      ? rawRole
      : "your target role";
  const levelLabel =
    rawLevel && rawLevel.toLowerCase() !== "general"
      ? `${rawLevel} level`
      : "your current level";
  const isEarlyCareer =
    !rawLevel ||
    ["general", "student", "intern", "entry", "entry-level", "junior", "beginner"].some(
      (term) => rawLevel.toLowerCase().includes(term),
    );
  const resourcePrompt =
    roleLabel === "your target role"
      ? "Suggest a resource for my next career step"
      : `Suggest a resource for ${roleLabel}`;
  const roleQuestionPrompt =
    roleLabel === "your target role"
      ? "Ask me a role-specific follow-up question"
      : `Ask me a ${roleLabel} follow-up question`;
  const projectPrompt =
    roleLabel === "your target role"
      ? "Recommend a beginner-friendly practice project"
      : `Recommend a ${roleLabel} practice project`;

  const promptSuggestions = useMemo(() => {
    const careerPrompts = [
      careerContext?.roadmap?.nextMilestone
        ? `Complete milestone: ${careerContext.roadmap.nextMilestone}`
        : careerContext?.roadmap?.activeMilestone
          ? `Advance milestone: ${careerContext.roadmap.activeMilestone}`
          : null,
      careerContext?.interview?.weakestQuestions?.[0]
        ? `Practice interview question: ${careerContext.interview.weakestQuestions[0]}`
        : careerContext?.interview?.suggestedPracticeAreas?.[0]
          ? `Practice interview area: ${careerContext.interview.suggestedPracticeAreas[0]}`
          : null,
      careerContext?.resume?.missingSkills?.[0]
        ? `Fix resume gap: ${careerContext.resume.missingSkills[0]}`
        : careerContext?.resume?.keywordGaps?.[0]
          ? `Add resume keyword: ${careerContext.resume.keywordGaps[0]}`
          : careerContext?.resume?.improvementSuggestions?.[0]
            ? `Improve resume: ${careerContext.resume.improvementSuggestions[0]}`
            : null,
      careerContext?.roadmap?.skillsToBuild?.[0]
        ? `Build skill for ${roleLabel}: ${careerContext.roadmap.skillsToBuild[0]}`
        : null,
    ].filter((prompt): prompt is string => Boolean(prompt));

    if (careerPrompts.length) {
      return careerPrompts.slice(0, 3);
    }

    const lastAssistant = [...sessionMessages]
      .reverse()
      .find((message) => message.role === "assistant")?.content.toLowerCase();

    if (lastAssistant?.includes("resume")) {
      return [
        `Rewrite my resume summary for ${roleLabel}`,
        `Find ${roleLabel} resume keywords`,
        "Make my strongest bullets measurable",
      ];
    }

    if (lastAssistant?.includes("interview")) {
      return [
        roleQuestionPrompt,
        "Create a 20-minute practice plan",
        `Show a stronger ${levelLabel} sample answer`,
      ];
    }

    if (lastAssistant?.includes("skill") || lastAssistant?.includes("roadmap")) {
      return [
        "Prioritize my next skills",
        "Turn this into weekly tasks",
        "Suggest portfolio projects",
      ];
    }

    if (
      lastAssistant?.includes("course") ||
      lastAssistant?.includes("resource") ||
      lastAssistant?.includes("learn") ||
      lastAssistant?.includes("career")
    ) {
      return [
        `Suggest one course for ${roleLabel}`,
        `Create a ${levelLabel} learning path`,
        projectPrompt,
      ];
    }

    if (isEarlyCareer) {
      return [
        `Write my first ${roleLabel} resume summary`,
        `Create a 7-day ${roleLabel} interview prep plan`,
        `Pick one beginner project for ${roleLabel}`,
      ];
    }

    return [
      `Improve my ${roleLabel} resume bullets`,
      `Practice a ${levelLabel} ${roleLabel} interview question`,
      resourcePrompt,
    ];
  }, [
    isEarlyCareer,
    careerContext,
    levelLabel,
    projectPrompt,
    resourcePrompt,
    roleLabel,
    roleQuestionPrompt,
    sessionMessages,
  ]);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [sessionMessages, scrollToBottom]);

  const handleSend = async () => {
    if (!inputValue.trim() || isStreaming) return;
    const content = inputValue;
    setInputValue("");
    await sendMessage(content);
  };

  const handleSuggestion = async (content: string) => {
    if (isStreaming) return;
    setInputValue("");
    await sendMessage(content);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-card">
      <div
        ref={scrollRef}
        className="flex-1 space-y-6 overflow-y-auto p-4 scrollbar-hide sm:p-6 lg:p-8"
      >
        {sessionMessages.map((msg, idx) => (
          <div
            key={msg.id}
            className={cn(
              "flex max-w-[94%] gap-3 sm:gap-5 lg:max-w-[82%]",
              msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto",
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border shadow-sm sm:h-12 sm:w-12",
                msg.role === "user"
                  ? "bg-primary border-primary/20 text-primary-foreground"
                  : "bg-muted/40 border-border text-primary",
              )}
            >
              {msg.role === "user" ? (
                <User className="h-6 w-6" />
              ) : (
                <CareerPilotTrajectoryIcon className="h-6 w-6" />
              )}
            </div>

            <div
              className={cn(
                "relative rounded-3xl border p-4 text-sm font-medium leading-7 tracking-wide shadow-sm sm:p-6 lg:text-base",
                msg.role === "user"
                  ? "bg-primary border-primary/20 text-primary-foreground rounded-tr-none"
                  : "bg-card border-border text-foreground/90 rounded-tl-none",
              )}
            >
              <div className="whitespace-pre-line">{msg.content}</div>
              {msg.role === "assistant" && msg.metadata?.fallback && (
                <AiFallbackNotice
                  retryAfterMs={msg.metadata.retryAfterMs}
                  isStreaming={isStreaming}
                  onRetry={() => {
                    const previousUserMessage = [...sessionMessages]
                      .slice(0, idx)
                      .reverse()
                      .find((message) => message.role === "user")?.content;

                    return sendMessage(
                      previousUserMessage
                        ? `Please retry this request now: ${previousUserMessage}`
                        : "Please retry my previous career mentoring request now.",
                    );
                  }}
                />
              )}
              {msg.role === "assistant" &&
                isStreaming &&
                idx === sessionMessages.length - 1 && (
                  <span className="inline-block w-2.5 h-6 ml-2 rounded-full bg-primary/60 animate-pulse align-middle" />
                )}
            </div>
          </div>
        ))}

        {isStreaming &&
          sessionMessages[sessionMessages.length - 1]?.role === "user" && (
            <div className="mr-auto flex max-w-[94%] items-center gap-3 sm:gap-5 lg:max-w-[82%]">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-border bg-muted/40 shadow-sm sm:h-12 sm:w-12">
                <CareerPilotTrajectoryIcon className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <div className="rounded-3xl rounded-tl-none border border-border bg-card p-4 text-sm text-muted-foreground shadow-sm sm:p-6">
                <TypingIndicator />
              </div>
            </div>
          )}
      </div>

      <div className="border-t border-border bg-background/80 p-6">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {promptSuggestions.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSuggestion(prompt)}
              disabled={isStreaming}
              className="inline-flex max-w-[78vw] shrink-0 items-center gap-2 rounded-2xl border border-border/60 bg-muted/40 px-3 py-2 text-left text-xs font-semibold leading-5 text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground disabled:opacity-50 sm:max-w-none"
            >
              <CareerPilotTrajectoryIcon className="h-3.5 w-3.5" />
              {prompt}
            </button>
          ))}
        </div>
        {isStreaming && (
          <div className="mb-3 rounded-2xl border border-accent/15 bg-accent/[0.055] px-4 py-3 animate-in fade-in slide-in-from-bottom-1 duration-300">
            <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              <span>AI is processing</span>
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="h-2 overflow-hidden rounded-full border border-border/60 bg-muted/60">
              <div className="h-full w-1/3 animate-[chat-progress_1.3s_ease-in-out_infinite] rounded-full bg-accent" />
            </div>
            <style jsx>{`
              @keyframes chat-progress {
                0% {
                  transform: translateX(-120%);
                }
                100% {
                  transform: translateX(360%);
                }
              }
            `}</style>
          </div>
        )}
        <div className="flex items-center gap-3 rounded-[1.5rem] border border-border bg-card px-3 py-3 shadow-sm sm:gap-4 sm:px-4 sm:py-4">
          <Input
            placeholder="Ask about resumes, interviews, skills, or career moves..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isStreaming}
            className="flex-1 bg-transparent border-none px-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isStreaming}
            size="icon"
            className="h-14 w-14 rounded-[1.25rem]"
          >
            {isStreaming ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

function formatRetryAfter(retryAfterMs: number) {
  if (retryAfterMs <= 0) return "ready now";
  const minutes = Math.ceil(retryAfterMs / 60000);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  const hours = Math.ceil(minutes / 60);
  return `${hours} hour${hours === 1 ? "" : "s"}`;
}

function formatCountdown(ms: number) {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function AiFallbackNotice({
  retryAfterMs,
  isStreaming,
  onRetry,
}: {
  retryAfterMs?: number;
  isStreaming: boolean;
  onRetry: () => Promise<void>;
}) {
  const initialRetryMs = Math.max(0, retryAfterMs ?? 5 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState(initialRetryMs);
  const [isRetrying, setIsRetrying] = useState(false);
  const [didPressRetry, setDidPressRetry] = useState(false);
  const [postRetryCooldown, setPostRetryCooldown] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const canRetry = remainingMs <= 0 && !isStreaming && !isRetrying;
  const progress =
    initialRetryMs > 0
      ? Math.min(100, Math.max(0, 100 - (remainingMs / initialRetryMs) * 100))
      : 100;
  const retryLabel =
    remainingMs > 0
      ? postRetryCooldown
        ? `Retry in ${formatCountdown(remainingMs)}`
        : `Retry available in ${formatCountdown(remainingMs)}`
      : isRetrying
        ? "Retrying now"
        : "Retry now";

  useEffect(() => {
    setRemainingMs(initialRetryMs);
    setPostRetryCooldown(false);
    setJustUnlocked(false);
  }, [initialRetryMs]);

  useEffect(() => {
    if (remainingMs <= 0) return;

    const timer = window.setInterval(() => {
      setRemainingMs((current) => {
        const next = Math.max(0, current - 1000);
        if (current > 0 && next === 0) {
          setPostRetryCooldown(false);
          setJustUnlocked(true);
          window.setTimeout(() => setJustUnlocked(false), 900);
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [remainingMs]);

  const handleRetry = async () => {
    if (!canRetry) return;
    setDidPressRetry(true);
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
      setPostRetryCooldown(true);
      setRemainingMs(POST_RETRY_LOCK_MS);
      window.setTimeout(() => setDidPressRetry(false), 450);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-primary/25 bg-primary/10 p-4 text-sm leading-6 text-primary shadow-lg shadow-elevation/5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-3 flex items-center gap-2 font-semibold">
        <ShieldAlert className="h-4 w-4" />
        Manual guidance is active
      </div>
      <div className="mb-4 rounded-xl border border-primary/20 bg-muted/40 p-3">
        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Clock3
              className={cn(
                "h-4 w-4 transition-colors",
                remainingMs <= 0 && "text-accent",
              )}
            />
            {remainingMs > 0 ? "Retry cooldown" : "Retry unlocked"}
          </div>
          <span
            className={cn(
              "font-mono text-lg font-semibold",
              remainingMs <= 0 && "animate-pulse text-accent",
            )}
          >
            {formatCountdown(remainingMs)}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted/50">
          <div
            className="h-full rounded-full bg-accent transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Resume", "Tailor one summary, quantify two bullets, then match keywords from one job post."],
          ["Interview", "Practice three STAR stories and keep each answer under 90 seconds."],
          ["Career", "Pick one role, one missing skill, and one portfolio action for this week."],
        ].map(([title, text]) => (
          <div key={title} className="rounded-xl bg-muted/40 p-3">
            <p className="font-semibold text-primary">{title}</p>
            <p className="mt-1 text-xs text-primary">{text}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-primary">
          {remainingMs > 0
            ? `Retry becomes available in ${formatRetryAfter(remainingMs)}.`
            : "Retry is available now."}
        </p>
        <Button
          type="button"
          size="sm"
          onClick={handleRetry}
          disabled={!canRetry}
          className={cn(
            "w-full rounded-xl bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto",
            canRetry && "shadow-lg shadow-elevation/5 ring-2 ring-accent/35",
            justUnlocked && "scale-[1.02] bg-accent ring-4 ring-accent/50",
            isRetrying && "animate-pulse bg-accent shadow-elevation/5 ring-2 ring-accent/60 hover:bg-accent",
            didPressRetry && "scale-[0.98] bg-accent shadow-elevation/5 hover:bg-accent",
          )}
        >
          {isRetrying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {retryLabel}
        </Button>
      </div>
    </div>
  );
}

function TypingIndicator() {
  const stages = [
    "Reviewing your context",
    "Checking career signals",
    "Drafting guidance",
  ];
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStageIndex((current) => (current + 1) % stages.length);
    }, 1400);

    return () => window.clearInterval(timer);
  }, [stages.length]);

  return (
    <div className="min-w-[240px] space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <span className="font-medium text-foreground/80 transition-opacity duration-300">
          {stages[stageIndex]}
        </span>
        <span className="flex items-center gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="h-2 w-2 rounded-full bg-primary"
              style={{
                animation: "typing-bounce 1s ease-in-out infinite",
                animationDelay: `${index * 0.15}s`,
              }}
            />
          ))}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted/60">
        <div className="h-full w-1/2 rounded-full bg-accent animate-[typing-scan_1.6s_ease-in-out_infinite]" />
      </div>
      <style jsx>{`
        @keyframes typing-bounce {
          0%,
          80%,
          100% {
            opacity: 0.35;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-4px);
          }
        }
        @keyframes typing-scan {
          0% {
            transform: translateX(-110%);
          }
          100% {
            transform: translateX(220%);
          }
        }
      `}</style>
    </div>
  );
}
