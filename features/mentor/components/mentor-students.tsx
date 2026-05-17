"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, Mail, UserCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { mentorApi } from "@/services/api/mentor";
import { formatRelativeTime } from "@/features/dashboard/utils/dashboard-format";
import { TableLoading } from "@/shared/components/loading/loading-system";

export function MentorStudents() {
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
            <div className="divide-y divide-border/60">
              {assignedUsers.map((assignment) => {
                const user = assignment.user;
                const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Student";
                const initials = displayName.substring(0, 2).toUpperCase();

                return (
                  <div key={assignment.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{displayName}</p>
                        <p className="text-sm text-muted-foreground">
                          {user?.email || "No email provided"}
                        </p>
                        {user?.targetRole && (
                          <p className="mt-1 text-xs font-medium text-primary/80">
                            Target: {user.targetRole}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 text-right">
                      <p className="text-xs text-muted-foreground">
                        Assigned {formatRelativeTime(assignment.assignedAt)}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-full">
                          <UserCircle className="mr-2 h-4 w-4" />
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full">
                          <Mail className="mr-2 h-4 w-4" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
