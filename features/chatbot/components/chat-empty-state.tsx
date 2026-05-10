"use client";

import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

export const ChatEmptyState = () => (
  <Card className="h-full border border-border shadow-sm">
    <CardContent className="flex h-full flex-col items-center justify-center gap-8 p-10 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        <Sparkles className="h-10 w-10" />
      </div>

      <div className="space-y-3 max-w-md">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Career Assistant Ready
        </h2>
        <p className="text-sm leading-7 text-muted-foreground">
          Start a new session to explore personalized guidance, refine your
          resume, or practice for interviews.
        </p>
      </div>

      <div className="grid w-full max-w-lg grid-cols-2 gap-3">
        {["Strategy", "Resume", "Interviews", "Market"].map((tag) => (
          <div
            key={tag}
            className="rounded-3xl border border-border bg-[#111827] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          >
            {tag}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
