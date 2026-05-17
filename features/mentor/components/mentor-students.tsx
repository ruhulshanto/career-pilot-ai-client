"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mail, UserCircle, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { mentorApi, MentorAssignment } from "@/services/api/mentor";
import { formatRelativeTime } from "@/features/dashboard/utils/dashboard-format";
import { TableLoading } from "@/shared/components/loading/loading-system";
import { getPublicImageUrl } from "@/shared/utils/image";
import { MentorStudentProfileModal } from "./mentor-student-profile-modal";
import { ProfileImagePreview } from "@/shared/components/ui/profile-image-preview";

export function MentorStudents() {
  const [selectedAssignment, setSelectedAssignment] = useState<MentorAssignment | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["mentor", "dashboard"],
    queryFn: mentorApi.getDashboard,
  });

  if (isLoading) {
    return <TableLoading rows={4} columns={3} />;
  }

  const assignedUsers = data?.assignedUsers || [];

  return (
    <div className="space-y-6">
      <Card className="border border-border/60 bg-muted/30">
        <CardHeader className="border-b border-border/60 p-5">
          <CardTitle>Assigned Students</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {assignedUsers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No students assigned yet.
            </div>
          ) : (
            <div className="space-y-4 p-4 sm:p-5">
              {assignedUsers.map((assignment) => {
                const user = assignment.user;
                const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Student";
                const initials = displayName.substring(0, 2).toUpperCase();
                const avatarUrl = user?.avatarUrl ? getPublicImageUrl(user.avatarUrl) : null;

                return (
                  <div
                    key={assignment.id}
                    className="rounded-3xl border border-border/60 bg-card/80 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl sm:grid sm:grid-cols-[1.55fr_0.95fr] sm:items-center"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="shrink-0">
                        <ProfileImagePreview avatarUrl={user?.avatarUrl} name={displayName}>
                          <div className="group block overflow-hidden rounded-3xl border border-border/50 bg-muted/70 transition hover:border-primary/70 hover:ring-2 hover:ring-primary/10 cursor-pointer">
                            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl bg-secondary/10 text-xl font-semibold text-primary">
                              {avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={avatarUrl} alt={`${displayName} profile`} className="h-full w-full object-cover" />
                              ) : (
                                initials
                              )}
                            </div>
                          </div>
                        </ProfileImagePreview>
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-lg font-semibold text-foreground">{displayName}</p>
                        <p className="truncate text-sm text-muted-foreground">{user?.email || "No email provided"}</p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-muted/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                            Assigned {formatRelativeTime(assignment.assignedAt)}
                          </span>
                          {user?.targetRole && (
                            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                              Target: {user.targetRole}
                            </span>
                          )}
                          {assignment.status && (
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                              {assignment.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between sm:mt-0 sm:justify-end gap-3">
                      <div className="rounded-3xl bg-muted/40 px-4 py-2 text-center text-xs font-medium text-muted-foreground hidden sm:block">
                        Mentor assigned this student.
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-full bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary border border-primary/20 transition-colors shrink-0 shadow-sm"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/40 shadow-xl backdrop-blur-xl bg-background/95 p-1.5">
                          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground px-2 py-1.5">
                            {user?.username ? `@${user.username}` : "Student Actions"}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="my-1" />
                          <DropdownMenuItem 
                            className="cursor-pointer rounded-lg px-2 py-1.5 text-xs font-medium"
                            onClick={() => setSelectedAssignment(assignment)}
                          >
                            <UserCircle className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-2 py-1.5 text-xs font-medium">
                            <a href={`mailto:${user?.email || ''}?subject=CareerAI%20Mentorship%20Update&body=Hi%20${user?.firstName || 'Student'},%0A%0A`}>
                              <Mail className="mr-2 h-4 w-4" />
                              Message Student
                            </a>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <MentorStudentProfileModal 
        student={selectedAssignment?.user ?? null}
        assignment={selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
      />
    </div>
  );
}
