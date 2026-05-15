"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MonitorSmartphone, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { authApi } from "@/services/auth/auth-api";
import { useToast } from "@/shared/hooks/use-toast";

type Session = {
  id: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  lastSeenAt: string;
  expiresAt: string;
  createdAt: string;
  isCurrent: boolean;
};

export function SecuritySessions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const sessionsQuery = useQuery({
    queryKey: ["auth-sessions"],
    queryFn: async () => {
      const response = await authApi.sessions();
      return (response.data ?? []) as Session[];
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (sessionId: string) => authApi.revokeSession(sessionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth-sessions"] });
      toast({
        variant: "success",
        title: "Session revoked",
        description: "That device no longer has access.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Could not revoke session",
        description: error.message || "Please try again.",
      });
    },
  });

  const revokeOthersMutation = useMutation({
    mutationFn: () => authApi.revokeOtherSessions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth-sessions"] });
      toast({
        variant: "success",
        title: "Other sessions logged out",
        description: "Only this device remains active.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Could not update sessions",
        description: error.message || "Please try again.",
      });
    },
  });

  const sessions = sessionsQuery.data ?? [];

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShieldCheck className="h-5 w-5 text-accent0" />
              Account security
            </CardTitle>
            <CardDescription>
              Review active devices and revoke sessions you do not recognize.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={() => revokeOthersMutation.mutate()}
            disabled={revokeOthersMutation.isPending || sessions.length <= 1}
          >
            Logout other sessions
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessionsQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading active sessions...</p>
        ) : null}
        {!sessionsQuery.isLoading && sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active sessions found.</p>
        ) : null}
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex flex-col gap-4 rounded-xl border border-border bg-background/40 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 gap-3">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MonitorSmartphone className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-semibold">
                    {session.userAgent || "Unknown device"}
                  </p>
                  {session.isCurrent ? (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                      Current
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {session.ipAddress || "Unknown IP"} - Last active{" "}
                  {new Date(session.lastSeenAt).toLocaleString()}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              disabled={session.isCurrent || revokeMutation.isPending}
              onClick={() => revokeMutation.mutate(session.id)}
            >
              Revoke
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
