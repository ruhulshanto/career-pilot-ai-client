"use client";

import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Loader2, Route, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { mentorApi } from "@/services/api/mentor";
import { formatRelativeTime } from "@/features/dashboard/utils/dashboard-format";
import { TableLoading } from "@/shared/components/loading/loading-system";

export function MentorReviews() {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["mentor", "reviews"],
    queryFn: mentorApi.listReviews,
  });

  if (isLoading) {
    return <TableLoading rows={4} columns={3} />;
  }

  return (
    <div className="space-y-6">
      <Card className="border border-border/60 bg-muted/30">
        <CardHeader className="border-b border-border/60 p-5">
          <CardTitle>Review History & Queue</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!reviews || reviews.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No reviews available.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {reviews.map((review) => {
                const user = review.user;
                const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Student";
                
                return (
                  <div key={review.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {review.type === "ROADMAP" || review.type === "MILESTONE" ? (
                          <Route className="h-5 w-5" />
                        ) : review.type === "INTERVIEW" ? (
                          <MessageSquare className="h-5 w-5" />
                        ) : (
                          <ClipboardList className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{review.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          From {displayName} • {formatRelativeTime(review.createdAt)}
                        </p>
                        <p className="mt-3 text-sm text-muted-foreground/90">
                          {review.message || "No specific message provided."}
                        </p>
                        <div className="mt-3 flex items-center gap-3 text-xs font-medium">
                          <span className="rounded-full border border-border/60 bg-background/50 px-2 py-0.5 uppercase tracking-wider">
                            {review.status}
                          </span>
                          <span className="text-primary/70 uppercase tracking-wider">
                            {review.type}
                          </span>
                          {review.score && (
                            <span className="font-semibold text-accent">
                              Score: {review.score}
                            </span>
                          )}
                        </div>
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
