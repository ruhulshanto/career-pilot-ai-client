"use client";

import React, { useEffect, useState } from "react";
import { useChatbotStore } from "@/shared/store/use-chatbot-store";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { SessionItem } from "./session-item";
import { ChatEmptyState } from "./chat-empty-state";
import { ChatInterface } from "./chat-interface";
import { Card } from "@/shared/components/ui/card";

export const ChatbotPanel = () => {
  const {
    sessions,
    activeSessionId,
    isLoading,
    error,
    fetchSessions,
    loadSession,
  } = useChatbotStore();

  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleNewSession = async () => {
    setIsCreating(true);
    try {
      const { chatbotApi } = await import("@/services/api/chatbot");
      const newSession = await chatbotApi.createSession({
        title: `New Consultation ${sessions.length + 1}`,
      });
      await fetchSessions();
      await loadSession(newSession.id);
    } catch (err) {
      console.error("Failed to create session:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="min-h-[calc(100vh-14rem)] overflow-hidden border border-border shadow-sm">
      <div className="grid min-h-full gap-px bg-border lg:grid-cols-[320px_1fr]">
        <aside className="flex flex-col bg-card p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Sessions
              </p>
              <p className="text-sm text-foreground/80">
                Manage active chat history
              </p>
            </div>
            <Button
              size="icon"
              onClick={handleNewSession}
              disabled={isCreating}
              variant="secondary"
              className="h-11 w-11"
              aria-label="New consultation"
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>

          <ScrollArea className="flex-1 overflow-hidden">
            <div className="space-y-3 px-1">
              {isLoading && sessions.length === 0
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex gap-4 rounded-3xl bg-[#111827] p-4 animate-pulse"
                    >
                      <div className="h-10 w-10 rounded-2xl bg-white/5 shrink-0" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="h-4 w-3/4 rounded bg-white/10" />
                        <div className="h-3 w-1/2 rounded bg-white/5" />
                      </div>
                    </div>
                  ))
                : sessions.map((session) => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      isActive={activeSessionId === session.id}
                      onClick={() => loadSession(session.id)}
                    />
                  ))}
            </div>
          </ScrollArea>
        </aside>

        <main className="flex-1 flex flex-col bg-card p-6">
          {error && (
            <div className="mb-6">
              <Alert
                variant="destructive"
                className="border-red-500/50 shadow-sm"
              >
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="text-xs font-black uppercase tracking-[0.2em]">
                  Connection Error
                </AlertTitle>
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            {activeSessionId ? (
              <ChatInterface sessionId={activeSessionId} />
            ) : (
              <ChatEmptyState />
            )}
          </div>
        </main>
      </div>
    </Card>
  );
};
