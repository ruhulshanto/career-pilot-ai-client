"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Bot,
  BriefcaseBusiness,
  Compass,
  FileSearch,
  Loader2,
  MessageSquareText,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { chatbotApi } from "@/services/api/chatbot";
import type { PublicChatMessage } from "@/shared/types/chatbot";

const createMessageId = () =>
  `public_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const starterPrompts = [
  {
    label: "Review my resume strategy",
    prompt:
      "Review my resume strategy for a frontend engineer role and tell me what to improve first.",
    icon: FileSearch,
  },
  {
    label: "Become a frontend engineer",
    prompt:
      "How do I become a frontend engineer if I already know basic JavaScript?",
    icon: Sparkles,
  },
  {
    label: "Find missing data skills",
    prompt:
      "What skills am I missing for data science, and how should I close the gap?",
    icon: Compass,
  },
  {
    label: "Prepare for interviews",
    prompt:
      "Help me prepare for technical and behavioral interviews this month.",
    icon: MessageSquareText,
  },
] as const;

const initialMessage: PublicChatMessage = {
  id: "public-assistant-intro",
  role: "assistant",
  content:
    "Give me a role target, a resume concern, or an interview scenario. I will turn it into a practical next move. Public preview chats are temporary; your dashboard workspace saves deeper plans.",
  timestamp: new Date(0).toISOString(),
};

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message?: unknown }).message);
  }

  return "The public assistant could not respond right now. Please try again in a moment.";
};

export function HomepageAssistant() {
  const [messages, setMessages] = useState<PublicChatMessage[]>([
    initialMessage,
  ]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isSending]);

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isSending) return;

    const userMessage: PublicChatMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };
    const contextMessages = messages
      .filter((message) => message.id !== initialMessage.id)
      .slice(-6)
      .map(({ role, content: messageContent }) => ({
        role,
        content: messageContent,
      }));

    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setError(null);
    setIsSending(true);

    try {
      const assistantMessage = await chatbotApi.sendPublicMessage({
        content: trimmed,
        recentMessages: contextMessages,
      });
      setMessages((current) => [...current, assistantMessage]);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(draft);
  };

  return (
    <div className="rounded-2xl border border-border bg-card/85 p-3 shadow-xl shadow-elevation/10">
      <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
        <div className="border-b border-border/80 px-5 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Career Pilot AI</p>
                <p className="text-xs text-muted-foreground">
                  Public career copilot
                </p>
              </div>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              <span className="h-2 w-2 rounded-full bg-accent" />
              stateless preview
            </div>
          </div>

          <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
            {[
              { label: "Resume strategy", icon: FileSearch },
              { label: "Role roadmap", icon: Compass },
              { label: "Interview coaching", icon: BriefcaseBusiness },
            ].map((item) => (
              <div
                key={item.label}
                className="flex min-w-0 items-center gap-2 rounded-lg border border-border/70 bg-background/35 px-3 py-2"
              >
                <item.icon className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px]">
            <div className="max-h-[360px] min-h-[300px] space-y-3 overflow-y-auto pr-1">
              {messages.map((message) => {
                const isUser = message.role === "user";
                const Icon = isUser ? UserRound : Bot;

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[88%] rounded-xl px-4 py-3 text-sm leading-6 ${
                        isUser
                          ? "bg-primary text-primary-foreground"
                          : "border border-border/80 bg-background/55 text-foreground"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>
                    {isUser && (
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isSending && (
                <div className="flex gap-3">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/55 px-4 py-3 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    Mapping the highest-leverage next move
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {starterPrompts.map((starter) => (
                <button
                  key={starter.label}
                  type="button"
                  onClick={() => void sendMessage(starter.prompt)}
                  disabled={isSending}
                  className="group flex min-w-0 items-center gap-2 rounded-lg border border-border/80 bg-muted/20 px-3 py-3 text-left text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <starter.icon className="h-4 w-4 shrink-0 text-primary transition group-hover:text-accent" />
                  <span className="min-w-0 leading-5">{starter.label}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-xs leading-5 text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="homepage-ai-question">
              Ask Career Pilot AI
            </label>
            <textarea
              id="homepage-ai-question"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about resumes, roles, interviews, or job search..."
              className="min-h-12 flex-1 resize-none rounded-xl border border-input bg-background/70 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              maxLength={1200}
              rows={1}
            />
            <Button
              type="submit"
              className="h-12 shrink-0"
              disabled={isSending || draft.trim().length < 2}
              aria-label="Send public assistant message"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
