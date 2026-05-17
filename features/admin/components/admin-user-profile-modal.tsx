"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  ShieldCheck, 
  Clock, 
  ShieldAlert, 
  FileText, 
  Map, 
  Video, 
  MessageSquare, 
  Zap, 
  MapPin, 
  Briefcase,
  Calendar,
  LogIn,
  Loader2,
  CheckCircle2,
  XCircle
} from "lucide-react";

import { adminApi } from "@/services/api/admin";
import { getPublicImageUrl } from "@/shared/utils/image";
import { cn } from "@/shared/lib/utils";
import { ProfileLoading } from "@/shared/components/loading/loading-system";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

interface AdminUserProfileModalProps {
  userId: string | null;
  onClose: () => void;
}

export function AdminUserProfileModal({ userId, onClose }: AdminUserProfileModalProps) {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["admin-user-detail", userId],
    queryFn: () => adminApi.getUserDetail(userId!),
    enabled: !!userId,
  });

  return (
    <Dialog open={!!userId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl border-border/60 bg-card shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/40 bg-muted/20">
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span>User Profile Snapshot</span>
            {user && (
              <span className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
                user.isActive 
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              )}>
                {user.isActive ? (
                  <><CheckCircle2 className="h-3.5 w-3.5" /> Active Account</>
                ) : (
                  <><XCircle className="h-3.5 w-3.5" /> Suspended</>
                )}
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            Detailed overview of identity, platform engagement, and AI consumption metrics.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[75vh] custom-scrollbar space-y-6">
          {isLoading ? (
            <ProfileLoading />
          ) : isError || !user ? (
            <div className="py-12 text-center text-muted-foreground">
              <ShieldAlert className="mx-auto h-12 w-12 text-destructive/50 mb-4" />
              <p className="text-base font-medium">Failed to load user profile details.</p>
              <p className="text-xs mt-1 text-muted-foreground/80">The account may have been fully deleted or is currently unavailable.</p>
            </div>
          ) : (
            <>
              {/* Header Profile Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-border/40">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-border/80 bg-muted shadow-md">
                  {user.avatarUrl ? (
                    <img
                      src={getPublicImageUrl(user.avatarUrl) ?? ""}
                      alt={user.firstName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-2xl font-bold text-primary">
                      {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-xl font-bold text-foreground truncate">
                      {user.firstName} {user.lastName}
                    </h3>
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase shadow-sm",
                      user.role === "ADMIN" ? "bg-destructive/10 text-destructive border border-destructive/20" :
                      user.role === "MENTOR" ? "bg-accent/10 text-accent border border-accent/20" :
                      "bg-primary/10 text-primary border border-primary/20"
                    )}>
                      {user.role}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                    <span>@{user.username}</span>
                    <span>•</span>
                    <span>{user.email}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 pt-1 text-xs text-muted-foreground">
                    {user.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" /> {user.location}
                      </span>
                    )}
                    {(user.currentCompany || user.currentPosition) && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5 text-muted-foreground/70" /> 
                        {user.currentPosition} {user.currentCompany ? `@ ${user.currentCompany}` : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio & Headline */}
              {(user.headline || user.bio) && (
                <div className="space-y-2 pb-6 border-b border-border/40">
                  {user.headline && (
                    <p className="text-sm font-semibold text-foreground/90 italic">
                      "{user.headline}"
                    </p>
                  )}
                  {user.bio && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {user.bio}
                    </p>
                  )}
                </div>
              )}

              {/* Engagement Metrics Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Platform Engagement & Creation
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 flex flex-col justify-between shadow-sm transition-transform hover:scale-[1.02]">
                    <div className="flex items-center justify-between text-muted-foreground mb-2">
                      <span className="text-xs font-medium">Resumes</span>
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {user._count.resumes}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 flex flex-col justify-between shadow-sm transition-transform hover:scale-[1.02]">
                    <div className="flex items-center justify-between text-muted-foreground mb-2">
                      <span className="text-xs font-medium">Roadmaps</span>
                      <Map className="h-4 w-4 text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {user._count.careerRoadmaps}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 flex flex-col justify-between shadow-sm transition-transform hover:scale-[1.02]">
                    <div className="flex items-center justify-between text-muted-foreground mb-2">
                      <span className="text-xs font-medium">Interviews</span>
                      <Video className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {user._count.interviewSessions}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 flex flex-col justify-between shadow-sm transition-transform hover:scale-[1.02]">
                    <div className="flex items-center justify-between text-muted-foreground mb-2">
                      <span className="text-xs font-medium">Chatbot</span>
                      <MessageSquare className="h-4 w-4 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {user._count.chatbotSessions}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Consumption Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  AI Copilot Consumption
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 flex items-center gap-4 shadow-sm">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Zap className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Total AI Prompts</p>
                      <p className="text-xl font-bold text-foreground mt-0.5">{user.aiUsage.totalRequests} requests</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 flex items-center gap-4 shadow-sm">
                    <div className="p-3 rounded-xl bg-accent/10 text-accent">
                      <Zap className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Total Token Volume</p>
                      <p className="text-xl font-bold text-foreground mt-0.5">{user.aiUsage.totalTokens.toLocaleString()} tokens</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps & Security Status */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Security & Activity Timestamps
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="rounded-xl border border-border/40 p-3.5 bg-card space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> Registered Date
                    </span>
                    <p className="font-semibold text-foreground">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/40 p-3.5 bg-card space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <LogIn className="h-3.5 w-3.5" /> Last Login
                    </span>
                    <p className="font-semibold text-foreground">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      }) : "Never logged in"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/40 p-3.5 bg-card space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5" /> Verification
                    </span>
                    <p className="font-semibold flex items-center gap-1">
                      {user.emailVerifiedAt ? (
                        <span className="text-emerald-500 flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="text-amber-500 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> Pending Verification
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-6 pt-4 border-t border-border/40 bg-muted/10 flex justify-end">
          <Button variant="outline" onClick={onClose} className="rounded-xl px-6">
            Close Snapshot
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
