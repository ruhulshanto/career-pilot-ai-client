"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarClock,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Route,
  Send,
  Star,
  UserRound,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/hooks/use-toast";
import { formatRelativeTime } from "@/features/dashboard/utils/dashboard-format";
import { mentorApi, type MentorReview } from "@/services/api/mentor";

const queryKeys = {
  mentor: ["mentor", "me"] as const,
  reviews: ["mentor", "reviews"] as const,
};

const reviewTypes: Array<{ label: string; value: MentorReview["type"]; icon: typeof Route }> = [
  { label: "Roadmap feedback", value: "ROADMAP", icon: Route },
  { label: "Resume review", value: "RESUME", icon: CheckCircle2 },
  { label: "Interview feedback", value: "INTERVIEW", icon: MessageSquare },
];

export function MentorUserCenter() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [reviewType, setReviewType] = useState<MentorReview["type"]>("ROADMAP");
  const [message, setMessage] = useState("");
  const [sessionTopic, setSessionTopic] = useState("Career strategy session");
  const mentorQuery = useQuery({
    queryKey: queryKeys.mentor,
    queryFn: mentorApi.getMyMentor,
  });
  const reviewsQuery = useQuery({
    queryKey: queryKeys.reviews,
    queryFn: mentorApi.listReviews,
  });
  const requestReviewMutation = useMutation({
    mutationFn: mentorApi.requestReview,
    onSuccess: () => {
      setMessage("");
      void queryClient.invalidateQueries({ queryKey: queryKeys.reviews });
      void queryClient.invalidateQueries({ queryKey: queryKeys.mentor });
      toast({
        variant: "success",
        title: "Mentor review requested",
        description: "Your mentor will see this in their review queue.",
      });
    },
  });
  const requestSessionMutation = useMutation({
    mutationFn: mentorApi.requestSession,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.mentor });
      toast({
        variant: "success",
        title: "Mentor session requested",
        description: "Your mentor can approve or suggest a new time.",
      });
    },
  });

  const mentor = mentorQuery.data?.mentor;
  const sessions = mentorQuery.data?.sessions ?? [];
  const reviews = reviewsQuery.data ?? [];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <Card className="border border-border/60 bg-muted/30">
          <CardHeader className="border-b border-border/60 p-5">
            <CardTitle className="text-lg">Assigned mentor</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {mentorQuery.isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : mentor ? (
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-primary/10">
                    {mentor.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={mentor.avatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <UserRound className="h-7 w-7 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {[mentor.firstName, mentor.lastName].filter(Boolean).join(" ")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {mentor.headline || mentor.currentPosition || "Career mentor"}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Star className="h-3.5 w-3.5 text-primary" />
                      {typeof mentor.mentorRating === "number"
                        ? `${mentor.mentorRating.toFixed(1)} rating`
                        : "New mentor"}
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {mentor.bio || "Your mentor can review roadmap progress, resumes, interviews, and career decisions."}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(mentor.mentorSpecialties ?? ["Roadmaps", "Interviews", "Resume strategy"]).map((item) => (
                    <span key={item} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">
                Request a review or session to be matched with an available mentor.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-muted/30">
          <CardHeader className="border-b border-border/60 p-5">
            <CardTitle className="text-lg">Request mentor review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <div className="grid gap-2 sm:grid-cols-3">
              {reviewTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setReviewType(type.value)}
                    className={`rounded-2xl border px-3 py-3 text-left text-sm transition ${
                      reviewType === type.value
                        ? "border-primary/40 bg-primary/10 text-foreground"
                        : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="mb-2 h-4 w-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>
            <Input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="What should your mentor focus on?"
              className="h-12 rounded-2xl"
            />
            <Button
              className="h-11 w-full rounded-2xl"
              disabled={requestReviewMutation.isPending}
              onClick={() =>
                requestReviewMutation.mutate({
                  type: reviewType,
                  title: `${reviewTypes.find((type) => type.value === reviewType)?.label}`,
                  message,
                })
              }
            >
              <Send className="h-4 w-4" />
              {requestReviewMutation.isPending ? "Sending" : "Request review"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-muted/30">
          <CardHeader className="border-b border-border/60 p-5">
            <CardTitle className="text-lg">Request mentor session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <Input
              value={sessionTopic}
              onChange={(event) => setSessionTopic(event.target.value)}
              className="h-12 rounded-2xl"
            />
            <Button
              variant="outline"
              className="h-11 w-full rounded-2xl"
              disabled={requestSessionMutation.isPending}
              onClick={() =>
                requestSessionMutation.mutate({
                  topic: sessionTopic,
                  message: "Requested from the mentor center.",
                })
              }
            >
              <CalendarClock className="h-4 w-4" />
              {requestSessionMutation.isPending ? "Requesting" : "Request session"}
            </Button>
            <div className="space-y-2 rounded-2xl border border-border/60 bg-muted/35 p-3">
              <p className="text-sm font-semibold text-foreground">
                Session status
              </p>
              {sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No mentor sessions requested yet.
                </p>
              ) : (
                sessions.slice(0, 3).map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="truncate text-muted-foreground">
                      {session.topic}
                    </span>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {session.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border/60 bg-muted/30">
        <CardHeader className="border-b border-border/60 p-5">
          <CardTitle className="text-lg">Mentor feedback timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-5">
          {reviewsQuery.isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Reviews and threaded mentor comments will appear here.
            </p>
          ) : (
            reviews.map((review) => <ReviewCard key={review.id} review={review} />)
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewCard({ review }: { review: MentorReview }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/35 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-semibold text-foreground">{review.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {review.type} - {review.status} - {formatRelativeTime(review.createdAt)}
          </p>
        </div>
        {typeof review.score === "number" ? (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {Math.round(review.score)}/100
          </span>
        ) : null}
      </div>
      {review.message ? (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{review.message}</p>
      ) : null}
      {review.verdict ? (
        <p className="mt-3 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-primary">
          {review.verdict}
        </p>
      ) : null}
      {review.comments?.length ? (
        <div className="mt-4 space-y-3">
          {review.comments.map((comment) => (
            <div key={comment.id} className="rounded-xl border border-border/60 bg-muted/35 px-3 py-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold text-foreground">
                  {[comment.author?.firstName, comment.author?.lastName].filter(Boolean).join(" ") || "Mentor"}
                </p>
                <span className="text-[11px] text-muted-foreground">
                  {formatRelativeTime(comment.createdAt)}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{comment.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-border/60 bg-muted/25 px-3 py-2 text-sm text-muted-foreground">
          No comments yet.
        </p>
      )}
    </div>
  );
}
