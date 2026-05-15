"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Calendar, Clock, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/hooks/use-toast";
import { mentorApi } from "@/services/api/mentor";
import { formatRelativeTime } from "@/features/dashboard/utils/dashboard-format";

export function MentorSchedule() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["mentor", "dashboard"],
    queryFn: mentorApi.getDashboard,
  });

  const updateSessionMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "APPROVED" | "REJECTED" }) =>
      mentorApi.updateSession(id, { status }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["mentor", "dashboard"] });
      toast({
        variant: "success",
        title: "Session updated",
        description: "The user has been notified.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl border border-border/60 bg-muted/40">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const upcomingSessions = data?.upcomingSessions || [];

  return (
    <div className="space-y-6">
      <Card className="border border-border/60 bg-muted/30">
        <CardHeader className="border-b border-border/60 p-5">
          <CardTitle>Schedule & Sessions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {upcomingSessions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No sessions scheduled at the moment.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {upcomingSessions.map((session) => {
                const user = session.user;
                const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Student";
                
                return (
                  <div key={session.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{session.topic}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          With {displayName}
                        </p>
                        {session.message && (
                          <p className="mt-2 text-sm italic text-muted-foreground/80">
                            "{session.message}"
                          </p>
                        )}
                        <div className="mt-3 flex items-center gap-4 text-xs font-medium text-foreground/80">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-primary/70" />
                            {session.durationMinutes} mins
                          </span>
                          {session.scheduledAt && (
                            <span className="flex items-center gap-1 text-primary">
                              <Video className="h-3.5 w-3.5" />
                              {new Date(session.scheduledAt).toLocaleString()}
                            </span>
                          )}
                          <span className="rounded-full border border-border/60 bg-background/50 px-2 py-0.5 uppercase tracking-wider">
                            {session.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {session.status === "REQUESTED" && (
                      <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <Button 
                          className="rounded-full"
                          disabled={updateSessionMutation.isPending}
                          onClick={() => updateSessionMutation.mutate({ id: session.id, status: "APPROVED" })}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          className="rounded-full"
                          disabled={updateSessionMutation.isPending}
                          onClick={() => updateSessionMutation.mutate({ id: session.id, status: "REJECTED" })}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
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
