"use client";

import React from "react";
import { 
  MapPin, 
  Briefcase,
  CheckCircle2,
  Calendar,
  UserCircle
} from "lucide-react";

import { getPublicImageUrl } from "@/shared/utils/image";
import { cn } from "@/shared/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { MentorUser, MentorAssignment } from "@/services/api/mentor";
import { formatRelativeTime } from "@/features/dashboard/utils/dashboard-format";
import Link from "next/link";

interface MentorStudentProfileModalProps {
  student: MentorUser | null;
  assignment: MentorAssignment | null;
  onClose: () => void;
}

export function MentorStudentProfileModal({ student, assignment, onClose }: MentorStudentProfileModalProps) {
  if (!student) return null;

  return (
    <Dialog open={!!student} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl border-border/60 bg-card shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/40 bg-muted/20">
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span>Student Profile Snapshot</span>
            {assignment && (
              <span className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
                assignment.status === "ACTIVE" || assignment.status === "ASSIGNED" 
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                  : "bg-primary/10 text-primary border border-primary/20"
              )}>
                <CheckCircle2 className="h-3.5 w-3.5" /> {assignment.status || "Assigned"}
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            Overview of student details and mentorship assignment.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[75vh] custom-scrollbar space-y-6">
          {/* Header Profile Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-border/40">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-border/80 bg-muted shadow-md">
              {student.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getPublicImageUrl(student.avatarUrl) ?? ""}
                  alt={student.firstName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-2xl font-bold text-primary">
                  {(student.firstName?.[0] || student.email?.[0] || "S").toUpperCase()}
                </div>
              )}
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-xl font-bold text-foreground truncate">
                  {[student.firstName, student.lastName].filter(Boolean).join(" ") || "Student"}
                </h3>
                {student.targetRole && (
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase shadow-sm bg-accent/10 text-accent border border-accent/20">
                    Target: {student.targetRole}
                  </span>
                )}
              </div>

              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                {student.username && <span>@{student.username}</span>}
                {student.username && student.email && <span>•</span>}
                {student.email && <span>{student.email}</span>}
              </p>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 pt-1 text-xs text-muted-foreground">
                {student.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" /> {student.location}
                  </span>
                )}
                {(student.currentCompany || student.currentPosition) && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground/70" /> 
                    {student.currentPosition} {student.currentCompany ? `@ ${student.currentCompany}` : ""}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bio & Headline */}
          {(student.headline || student.bio) && (
            <div className="space-y-2 pb-6 border-b border-border/40">
              {student.headline && (
                <p className="text-sm font-semibold text-foreground/90 italic">
                  "{student.headline}"
                </p>
              )}
              {student.bio && (
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {student.bio}
                </p>
              )}
            </div>
          )}

          {/* Assignment Details */}
          {assignment && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Mentorship Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border border-border/40 p-3.5 bg-card space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Assigned Date
                  </span>
                  <p className="font-semibold text-foreground">
                    {new Date(assignment.assignedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    ({formatRelativeTime(assignment.assignedAt)})
                  </p>
                </div>

                <div className="rounded-xl border border-border/40 p-3.5 bg-card space-y-1 flex flex-col justify-center">
                  <span className="text-muted-foreground">Status</span>
                  <p className="font-semibold text-foreground uppercase tracking-wide">
                    {assignment.status || "Assigned"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 pt-4 border-t border-border/40 bg-muted/10 flex justify-end gap-3">
          {student.username && (
            <Button asChild variant="default" className="rounded-xl px-6">
              <Link href={`/u/${student.username}`} target="_blank" rel="noopener noreferrer">
                <UserCircle className="mr-2 h-4 w-4" /> View Full Public Profile
              </Link>
            </Button>
          )}
          <Button variant="outline" onClick={onClose} className="rounded-xl px-6">
            Close Snapshot
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
