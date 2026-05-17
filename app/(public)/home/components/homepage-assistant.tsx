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
  UserRound,
} from "lucide-react";
import { CareerPilotTrajectoryIcon } from "@/shared/components/icons/CareerPilotTrajectoryIcon";
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
    icon: CareerPilotTrajectoryIcon,
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

import { motion, AnimatePresence } from "framer-motion";

const initialMessageText =
  "Give me a role target, a resume concern, or an interview scenario. I will turn it into a practical next move. Public preview chats are temporary; your dashboard workspace saves deeper plans.";

const TypewriterText = ({ text, delay = 0, duration = 1.5 }: { text: string; delay?: number; duration?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i));
        i++;
        if (i > text.length) clearInterval(interval);
      }, (duration * 1000) / text.length);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [text, delay, duration]);

  return <p className="whitespace-pre-wrap">{displayedText}</p>;
};

export function HomepageAssistant() {
  const [messages, setMessages] = useState<PublicChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullFirstMessage, setShowFullFirstMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Force window to top on mount
    window.scrollTo(0, 0);

    // Initial delay for entrance animation, then start typewriter
    const timer = setTimeout(() => {
      setMessages([{
        id: "initial",
        role: "assistant",
        content: initialMessageText,
        timestamp: new Date().toISOString()
      }]);
    }, 600);

    const doneTimer = setTimeout(() => {
      setShowFullFirstMessage(true);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(doneTimer);
    };
  }, []);

  useEffect(() => {
    // Only scroll if there are messages and it's not the very first mount
    if (messages.length > 1 || isSending) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
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
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl"
    >
      {/* ── Header ── */}
      <div className="border-b border-border/50 bg-muted/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <CareerPilotTrajectoryIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Career Pilot AI</h3>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Active Assistant</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="rounded-lg border border-border/60 px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Preview Mode
            </span>
          </div>
        </div>
      </div>

      {/* ── Chat Container ── */}
      <div className="flex flex-col h-[520px] p-4 sm:p-6 bg-background/50">
        <div className="flex-1 space-y-5 overflow-y-auto pr-1 custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((message, idx) => {
              const isUser = message.role === "user";
              const isFirst = message.id === "initial";
              
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isUser ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                  }`}>
                    {isUser ? <UserRound className="h-4 w-4" /> : <CareerPilotTrajectoryIcon className="h-4 w-4" />}
                  </div>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "border border-border/50 bg-card text-foreground/90 rounded-tl-none shadow-sm"
                  }`}>
                    {isFirst && !showFullFirstMessage ? (
                      <TypewriterText text={initialMessageText} duration={1.5} />
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isSending && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CareerPilotTrajectoryIcon className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-border/50 bg-card px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="text-xs">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Input Area ── */}
        <div className="mt-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {starterPrompts.map((s) => (
              <button
                key={s.label}
                onClick={() => void sendMessage(s.prompt)}
                disabled={isSending}
                className="rounded-full border border-border/60 bg-card px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-primary disabled:opacity-50"
              >
                {s.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage(draft);
                }
              }}
              placeholder="Type a message..."
              className="w-full min-h-[50px] max-h-32 resize-none rounded-2xl border border-border/60 bg-muted/20 py-3 pl-4 pr-12 text-sm outline-none transition-all focus:border-primary/50 focus:bg-background"
              rows={1}
            />
            <button
              disabled={isSending || !draft.trim()}
              className="absolute right-2.5 bottom-2 flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-opacity disabled:opacity-30"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-3 text-center text-[10px] text-muted-foreground/60 uppercase tracking-widest font-semibold">
            Press Enter to send
          </p>
        </div>
      </div>
    </motion.div>
  );
}
