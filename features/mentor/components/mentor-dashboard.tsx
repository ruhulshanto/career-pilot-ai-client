"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Loader2,
  MessageSquare,
  Route,
  Send,
  UsersRound,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/hooks/use-toast";
import { formatRelativeTime } from "@/features/dashboard/utils/dashboard-format";
import { mentorApi, type MentorReview } from "@/services/api/mentor";

const dashboardKey = ["mentor", "dashboard"] as const;

export function MentorDashboard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeReview, setActiveReview] = useState<MentorReview | null>(null);
  const [comment, setComment] = useState("");
  const [verdict, setVerdict] = useState("");
  const [score, setScore] = useState("85");
  const dashboardQuery = useQuery({
    queryKey: dashboardKey,
    queryFn: mentorApi.getDashboard,
  });
  const updateReviewMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MentorReview["status"] }) =>
      mentorApi.updateReview(id, {
        status,
        verdict,
        score: Number(score) || undefined,
      }),
    onSuccess: () => {
      setVerdict("");
      void queryClient.invalidateQueries({ queryKey: dashboardKey });
      toast({
        variant: "success",
        title: "Review updated",
        description: "The user has been notified.",
      });
    },
  });
  const addCommentMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: string }) =>
      mentorApi.addComment(id, { body }),
    onSuccess: (createdComment) => {
      setComment("");
      setActiveReview((current) =>
        current
          ? {
              ...current,
              comments: [...(current.comments ?? []), createdComment],
            }
          : current,
      );
      void queryClient.invalidateQueries({ queryKey: dashboardKey });
      toast({
        variant: "success",
        title: "Comment added",
        description: "Your feedback is now visible in the review thread.",
      });
    },
  });
  const updateSessionMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "APPROVED" | "REJECTED" }) =>
      mentorApi.updateSession(id, { status }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: dashboardKey });
      toast({
        variant: "success",
        title: "Session updated",
        description: "The user has been notified.",
      });
    },
  });

  if (dashboardQuery.isLoading) {
    return (
      <div className="flex items-center justify-center rounded-3xl border border-border/60 bg-muted/40 p-10">
        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const data = dashboardQuery.data;
  if (!data) return null;

  const stats = [
    { label: "Assigned users", value: data.stats.assignedUsers, icon: UsersRound },
    { label: "Pending reviews", value: data.stats.pendingReviews, icon: ClipboardList },
    { label: "Upcoming sessions", value: data.stats.upcomingSessions, icon: CalendarClock },
    { label: "Completed reviews", value: data.stats.completedReviews, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border border-border/60 bg-muted/30">
            <CardContent className="p-5">
              <stat.icon className="mb-4 h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border border-border/60 bg-muted/30">
          <CardHeader className="border-b border-border/60 p-5">
            <CardTitle>Review queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            {data.pendingReviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending reviews.</p>
            ) : (
              data.pendingReviews.map((review) => (
                <button
                  key={review.id}
                  type="button"
                  onClick={() => setActiveReview(review)}
                  className="w-full rounded-2xl border border-border/60 bg-muted/35 p-4 text-left transition hover:border-primary/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{review.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {review.type} - {review.status} - {formatRelativeTime(review.createdAt)}
                      </p>
                    </div>
                    {review.type === "ROADMAP" || review.type === "MILESTONE" ? (
                      <Route className="h-5 w-5 text-primary" />
                    ) : review.type === "INTERVIEW" ? (
                      <MessageSquare className="h-5 w-5 text-primary" />
                    ) : (
                      <ClipboardList className="h-5 w-5 text-accent" />
                    )}
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                    {review.message || "No extra context supplied."}
                  </p>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-muted/30">
          <CardHeader className="border-b border-border/60 p-5">
            <CardTitle>{activeReview ? "Review response" : "Mentor activity"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            {activeReview ? (
              <>
                <div>
                  <p className="font-semibold text-foreground">{activeReview.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    For {[activeReview.user?.firstName, activeReview.user?.lastName].filter(Boolean).join(" ") || "user"}
                  </p>
                </div>
                <div className="space-y-2 rounded-2xl border border-border/60 bg-muted/35 p-3">
                  <p className="text-sm font-semibold text-foreground">
                    Threaded comments
                  </p>
                  {activeReview.comments?.length ? (
                    activeReview.comments.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-border/60 bg-muted/35 px-3 py-2"
                      >
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-xs font-semibold text-foreground">
                            {[item.author?.firstName, item.author?.lastName].filter(Boolean).join(" ") || "User"}
                          </p>
                          <span className="text-[11px] text-muted-foreground">
                            {formatRelativeTime(item.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.body}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No comments yet.
                    </p>
                  )}
                </div>
                <Input
                  value={score}
                  onChange={(event) => setScore(event.target.value)}
                  placeholder="Score"
                  className="h-11 rounded-2xl"
                />
                <Input
                  value={verdict}
                  onChange={(event) => setVerdict(event.target.value)}
                  placeholder="Decision note or suggested next step"
                  className="h-11 rounded-2xl"
                />
                <Input
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Add threaded feedback"
                  className="h-11 rounded-2xl"
                />
                <div className="grid gap-2 sm:grid-cols-3">
                  <Button
                    className="rounded-2xl"
                    disabled={updateReviewMutation.isPending}
                    onClick={() => updateReviewMutation.mutate({ id: activeReview.id, status: "APPROVED" })}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    disabled={updateReviewMutation.isPending}
                    onClick={() => updateReviewMutation.mutate({ id: activeReview.id, status: "CHANGES_REQUESTED" })}
                  >
                    Request edits
                  </Button>
                  <Button
                    variant="ghost"
                    className="rounded-2xl"
                    disabled={!comment || addCommentMutation.isPending}
                    onClick={() => addCommentMutation.mutate({ id: activeReview.id, body: comment })}
                  >
                    <Send className="h-4 w-4" />
                    Comment
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                {data.activityFeed.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Mentor actions will appear here.</p>
                ) : (
                  data.activityFeed.map((item) => (
                    <div key={`${item.type}:${item.id}`} className="rounded-2xl border border-border/60 bg-muted/35 p-4">
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.type} - {item.status} - {formatRelativeTime(item.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <QueuePanel title="Roadmap review queue" items={data.roadmapReviewQueue} />
        <QueuePanel title="Resume review queue" items={data.resumeReviewQueue} />
      </div>

      <Card className="border border-border/60 bg-muted/30">
        <CardHeader className="border-b border-border/60 p-5">
          <CardTitle>Upcoming sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-5">
          {data.upcomingSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending mentor sessions.</p>
          ) : (
            data.upcomingSessions.map((session) => (
              <div key={session.id} className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/35 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-foreground">{session.topic}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {session.status} - {session.scheduledAt ? formatRelativeTime(session.scheduledAt) : "Time requested"}
                  </p>
                </div>
                {session.status === "REQUESTED" ? (
                  <div className="flex gap-2">
                    <Button size="sm" className="rounded-2xl" onClick={() => updateSessionMutation.mutate({ id: session.id, status: "APPROVED" })}>
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-2xl" onClick={() => updateSessionMutation.mutate({ id: session.id, status: "REJECTED" })}>
                      Reject
                    </Button>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function QueuePanel({ title, items }: { title: string; items: MentorReview[] }) {
  return (
    <Card className="border border-border/60 bg-muted/30">
      <CardHeader className="border-b border-border/60 p-5">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-5">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Queue is clear.</p>
        ) : (
          items.slice(0, 4).map((review) => (
            <div key={review.id} className="rounded-2xl border border-border/60 bg-muted/35 p-4">
              <p className="text-sm font-semibold text-foreground">{review.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{review.status}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
