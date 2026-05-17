"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useChatbotStore } from "@/shared/store/use-chatbot-store";
import { useAuthStore } from "@/shared/store/auth-store";
import { Plus, Loader2, AlertCircle, LogIn, Info, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ToastAction } from "@/shared/components/ui/toast";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { SessionItem } from "./session-item";
import { ChatEmptyState } from "./chat-empty-state";
import { ChatInterface } from "./chat-interface";
import { Card } from "@/shared/components/ui/card";
import { useToast } from "@/shared/hooks/use-toast";
import { useWorkspaceBase } from "@/shared/hooks/use-workspace-base";
import { getWorkspaceHref } from "@/shared/lib/role-routing";
import type { ChatbotSessionResponse } from "@/shared/types/chatbot";

export const ChatbotPanel = () => {
  const {
    sessions,
    pinnedSessionIds,
    activeSessionId,
    isLoading,
    error,
    errorCode,
    fetchSessions,
    hydratePinnedSessions,
    loadSession,
    sendMessage,
    renameSession,
    togglePinSession,
    deleteSession,
    setActiveSession,
  } = useChatbotStore();
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { toast } = useToast();
  const router = useRouter();
  const workspaceBase = useWorkspaceBase();
  const chatHref = getWorkspaceHref(workspaceBase, "chat");
  const chatLoginHref = `/login?next=${encodeURIComponent(chatHref)}`;

  const [isCreating, setIsCreating] = useState(false);
  const [sessionToDelete, setSessionToDelete] =
    useState<ChatbotSessionResponse | null>(null);
  const [sessionToShare, setSessionToShare] =
    useState<ChatbotSessionResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const sessionExpiredToastShown = useRef(false);
  const isSessionExpired = errorCode === "SESSION_EXPIRED";
  const sortedSessions = useMemo(() => {
    const pinnedOrder = new Map(
      pinnedSessionIds.map((sessionId, index) => [sessionId, index]),
    );

    return [...sessions].sort((a, b) => {
      const aPinned = pinnedOrder.has(a.id);
      const bPinned = pinnedOrder.has(b.id);

      if (aPinned && bPinned) {
        return (pinnedOrder.get(a.id) ?? 0) - (pinnedOrder.get(b.id) ?? 0);
      }

      if (aPinned) return -1;
      if (bPinned) return 1;
      return 0;
    });
  }, [pinnedSessionIds, sessions]);
  const shareUrl = sessionToShare
    ? `${typeof window !== "undefined" ? window.location.origin : ""}${chatHref}?session=${sessionToShare.id}`
    : "";

  useEffect(() => {
    hydratePinnedSessions();
    fetchSessions();
  }, [fetchSessions, hydratePinnedSessions]);

  useEffect(() => {
    if (!isSessionExpired) {
      sessionExpiredToastShown.current = false;
      return;
    }

    if (sessionExpiredToastShown.current) return;
    sessionExpiredToastShown.current = true;
    toast({
      title: "Session expired",
      description: (
        <div className="space-y-2">
          <p>Click here to log in again and continue your work.</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <button
              type="button"
              onClick={() => {
                logout();
                router.replace(chatLoginHref);
              }}
              className="font-medium text-foreground/75 underline underline-offset-4 transition-colors hover:text-primary"
            >
              Log out first
            </button>
            <span
              title="This clears the expired local token before you sign in again. Use it if login keeps returning you to the expired session."
              aria-label="Log out first clears a stale local session before signing in again."
              className="inline-flex cursor-help items-center"
            >
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </span>
          </div>
        </div>
      ),
      action: (
        <ToastAction
          altText="Log in again"
          onClick={() => router.replace(chatLoginHref)}
        >
          Log in
        </ToastAction>
      ),
    });
  }, [chatLoginHref, isSessionExpired, logout, router, toast]);

  const handleNewSession = async (initialMessage?: string) => {
    setIsCreating(true);
    try {
      const { chatbotApi } = await import("@/services/api/chatbot");
      const newSession = await chatbotApi.createSession({
        title: initialMessage
          ? initialMessage.slice(0, 48)
          : `New Consultation ${sessions.length + 1}`,
        context: {
          userProfile: {
            name: currentUser?.name,
            role: "Career growth",
            level: "General",
          },
        },
      });
      await fetchSessions();
      await loadSession(newSession.id);
      if (initialMessage) {
        await sendMessage(initialMessage);
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Conversation failed",
        description: "Could not create a new conversation. Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return;

    const deletingSession = sessionToDelete;

    setIsDeleting(true);
    try {
      await deleteSession(deletingSession.id);
      setSessionToDelete(null);

      toast({
        variant: "success",
        title: "Conversation deleted",
        description: `"${deletingSession.title || "Conversation"}" has been removed.`,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Could not delete this chat history. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRenameSession = async (sessionId: string, title: string) => {
    try {
      await renameSession(sessionId, title);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Rename failed",
        description: "Could not rename this conversation. Please try again.",
      });
      throw err;
    }
  };

  const handleCopyShareLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
    } catch {
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Could not copy the share link.",
      });
    }
  };

  return (
    <Card className="h-[calc(100vh-14rem)] min-h-[600px] overflow-hidden border border-border shadow-sm flex flex-col">
      <div className="grid h-full min-h-0 min-w-0 gap-px bg-border lg:grid-cols-[320px_minmax(0,1fr)] flex-1">
        <aside className={cn(
          "min-w-0 flex-col bg-card p-6 h-full min-h-0",
          activeSessionId ? "hidden lg:flex" : "flex",
        )}>
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
              onClick={() => handleNewSession()}
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

          <ScrollArea className="min-w-0 flex-1 overflow-hidden">
            <div className="w-full min-w-0 max-w-full space-y-3 overflow-x-hidden px-1">
              {isLoading && sessions.length === 0
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex gap-4 rounded-3xl bg-card p-4 animate-pulse"
                    >
                      <div className="h-10 w-10 rounded-2xl bg-muted/40 shrink-0" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="h-4 w-3/4 rounded bg-muted/60" />
                        <div className="h-3 w-1/2 rounded bg-muted/40" />
                      </div>
                    </div>
                  ))
                : sortedSessions.map((session) => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      isActive={activeSessionId === session.id}
                      isPinned={pinnedSessionIds.includes(session.id)}
                      onClick={() => loadSession(session.id)}
                      onRename={(title) =>
                        handleRenameSession(session.id, title)
                      }
                      onTogglePin={() => togglePinSession(session.id)}
                      onShare={() => {
                        setShareCopied(false);
                        setSessionToShare(session);
                      }}
                      onDelete={() => setSessionToDelete(session)}
                    />
                  ))}
            </div>
          </ScrollArea>
        </aside>

        <main className={cn(
          "min-w-0 flex-1 flex-col bg-card p-6 h-full min-h-0",
          activeSessionId ? "flex" : "hidden lg:flex",
        )}>
          {activeSessionId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSession(null)}
              className="mb-4 w-fit gap-2 px-0 text-muted-foreground hover:text-foreground lg:hidden"
            >
              ← Back to Conversations
            </Button>
          )}

          {error && (
            <div className="mb-6">
              <Alert
                variant="destructive"
                className={
                  isSessionExpired
                    ? "border-primary/40 bg-primary/10 text-primary shadow-lg shadow-elevation/5"
                    : "border-destructive/50 shadow-sm"
                }
              >
                {isSessionExpired ? (
                  <LogIn className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <AlertTitle className="text-xs font-black uppercase tracking-[0.2em]">
                  {isSessionExpired ? "Session Expired" : "Connection Error"}
                </AlertTitle>
                <AlertDescription className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    {isSessionExpired
                      ? "Your session has expired. Sign back in to continue your chat, roadmap, and interview work."
                      : error}
                  </span>
                  {isSessionExpired && (
                    <div className="flex flex-col gap-2 sm:items-end">
                      <Button
                        asChild
                        size="sm"
                        className="w-fit rounded-xl bg-primary text-primary-foreground hover:bg-primary"
                      >
                        <Link href={chatLoginHref}>
                          Sign back in
                        </Link>
                      </Button>
                      <span className="text-xs text-primary">
                        You will return to chat after sign-in.
                      </span>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="flex-1 overflow-hidden min-h-0">
            {activeSessionId ? (
              <ChatInterface sessionId={activeSessionId} />
            ) : (
              <ChatEmptyState onStart={handleNewSession} />
            )}
          </div>
        </main>
      </div>

      <AlertDialog
        open={Boolean(sessionToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setSessionToDelete(null);
        }}
      >
        <AlertDialogContent>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive">
              <Trash2 className="h-5 w-5" />
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this conversation?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes "{sessionToDelete?.title || "this conversation"}"
                and its message history from your account. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              onClick={() => setSessionToDelete(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              loading={isDeleting}
              onClick={handleDeleteSession}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(sessionToShare)}
        onOpenChange={(open) => {
          if (!open) {
            setSessionToShare(null);
            setShareCopied(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Temporary share link for "
              {sessionToShare?.title || "this conversation"}".
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-5 flex min-w-0 flex-col gap-3 sm:flex-row">
            <Input
              value={shareUrl}
              readOnly
              className="h-11 min-w-0 flex-1 text-sm"
              aria-label="Conversation share link"
            />
            <Button
              type="button"
              onClick={handleCopyShareLink}
              className="h-11 shrink-0 rounded-xl"
            >
              {shareCopied ? "Copied" : "Copy link"}
            </Button>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setSessionToShare(null);
                setShareCopied(false);
              }}
            >
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
