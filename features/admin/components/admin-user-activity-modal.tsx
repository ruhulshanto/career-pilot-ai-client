"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  ShieldAlert, 
  Activity, 
  Key, 
  Globe, 
  Laptop, 
  Calendar,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck
} from "lucide-react";

import { adminApi } from "@/services/api/admin";
import { cn } from "@/shared/lib/utils";
import { TableLoading } from "@/shared/components/loading/loading-system";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

interface AdminUserActivityModalProps {
  userId: string | null;
  username: string;
  onClose: () => void;
}

export function AdminUserActivityModal({ userId, username, onClose }: AdminUserActivityModalProps) {
  const [activeTab, setActiveTab] = useState<"events" | "sessions">("events");

  const { data: activity, isLoading, isError } = useQuery({
    queryKey: ["admin-user-activity", userId],
    queryFn: () => adminApi.getUserActivity(userId!),
    enabled: !!userId,
  });

  const getEventBadge = (type: string) => {
    switch (type) {
      case "AUTH":
        return { label: "Authentication", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
      case "ADMIN":
        return { label: "Admin Action", className: "bg-destructive/10 text-destructive border-destructive/20" };
      case "CHATBOT":
      case "AI":
      case "RESUME":
      case "ROADMAP":
      case "INTERVIEW":
        return { label: `AI / ${type}`, className: "bg-purple-500/10 text-purple-500 border-purple-500/20" };
      default:
        return { label: type, className: "bg-muted text-muted-foreground border-border" };
    }
  };

  return (
    <Dialog open={!!userId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl border-border/60 bg-card shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/40 bg-muted/20">
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Activity & Audit Logs
            </span>
            <span className="text-xs font-normal text-muted-foreground bg-background px-3 py-1 rounded-full border border-border/60">
              @{username}
            </span>
          </DialogTitle>
          <DialogDescription>
            Comprehensive security audit trail, AI interaction history, and active login sessions.
          </DialogDescription>

          {/* Custom Tabs Header */}
          <div className="flex items-center gap-2 pt-4 border-t border-border/40 mt-4">
            <Button
              variant={activeTab === "events" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("events")}
              className="rounded-xl px-4 text-xs font-semibold"
            >
              Platform Audit Events ({activity?.events.length ?? 0})
            </Button>
            <Button
              variant={activeTab === "sessions" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("sessions")}
              className="rounded-xl px-4 text-xs font-semibold"
            >
              Active Login Sessions ({activity?.sessions.length ?? 0})
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[65vh] custom-scrollbar">
          {isLoading ? (
            <div className="p-4">
              <TableLoading rows={4} columns={1} />
            </div>
          ) : isError || !activity ? (
            <div className="py-12 text-center text-muted-foreground">
              <ShieldAlert className="mx-auto h-12 w-12 text-destructive/50 mb-4" />
              <p className="text-base font-medium">Failed to load activity logs.</p>
              <p className="text-xs mt-1 text-muted-foreground/80">Audit records may be temporarily unavailable.</p>
            </div>
          ) : activeTab === "events" ? (
            <div className="space-y-3">
              {activity.events.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground border border-dashed border-border/60 rounded-2xl">
                  <Activity className="mx-auto h-8 w-8 opacity-20 mb-3" />
                  <p className="text-sm font-medium">No audit events recorded yet.</p>
                </div>
              ) : (
                activity.events.map((evt) => {
                  const badge = getEventBadge(evt.eventType);
                  return (
                    <div 
                      key={evt.id} 
                      className="rounded-xl border border-border/60 bg-muted/10 p-4 transition-colors hover:bg-muted/20 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
                            badge.className
                          )}>
                            {badge.label}
                          </span>
                          <span className="text-sm font-bold text-foreground">
                            {evt.eventName}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(evt.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground pt-1 border-t border-border/40">
                        {evt.ipAddress && (
                          <span className="flex items-center gap-1 font-mono">
                            <Globe className="h-3.5 w-3.5 text-muted-foreground/70" /> {evt.ipAddress}
                          </span>
                        )}
                        {evt.userAgent && (
                          <span className="flex items-center gap-1 truncate max-w-[300px]">
                            <Laptop className="h-3.5 w-3.5 text-muted-foreground/70" /> {evt.userAgent}
                          </span>
                        )}
                      </div>

                      {evt.metadata && Object.keys(evt.metadata).length > 0 && (
                        <div className="mt-2 rounded-lg bg-card p-2.5 font-mono text-[11px] text-muted-foreground border border-border/40 overflow-x-auto">
                          <pre>{JSON.stringify(evt.metadata, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {activity.sessions.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground border border-dashed border-border/60 rounded-2xl">
                  <Key className="mx-auto h-8 w-8 opacity-20 mb-3" />
                  <p className="text-sm font-medium">No active sessions found.</p>
                </div>
              ) : (
                activity.sessions.map((session) => (
                  <div 
                    key={session.id} 
                    className="rounded-xl border border-border/60 bg-muted/10 p-4 transition-colors hover:bg-muted/20 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Laptop className="h-4 w-4 text-primary" />
                        <span className="text-xs font-semibold text-foreground max-w-[400px] truncate">
                          {session.userAgent || "Unknown Device / Browser"}
                        </span>
                      </div>
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
                        session.revokedAt 
                          ? "bg-destructive/10 text-destructive border-destructive/20" 
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      )}>
                        {session.revokedAt ? (
                          <><XCircle className="h-3 w-3" /> Revoked</>
                        ) : (
                          <><CheckCircle2 className="h-3 w-3" /> Active</>
                        )}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-6 text-xs text-muted-foreground pt-2 border-t border-border/40">
                      {session.ipAddress && (
                        <span className="flex items-center gap-1 font-mono">
                          <Globe className="h-3.5 w-3.5 text-muted-foreground/70" /> {session.ipAddress}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground/70" /> Last seen: {new Date(session.lastSeenAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="p-6 pt-4 border-t border-border/40 bg-muted/10 flex justify-end">
          <Button variant="outline" onClick={onClose} className="rounded-xl px-6">
            Close Activity
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
