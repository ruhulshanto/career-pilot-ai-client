"use client";

import { History } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";

const mockHistory = [
  { role: "Senior React Architect", score: "85/100", date: "2 days ago" },
  { role: "Cloud Systems Engineer", score: "92/100", date: "1 week ago" },
];

export function InterviewHistory() {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="flex items-center gap-3 border-b border-border/70 px-6 py-5">
        <History className="w-5 h-5 text-primary" />
        <CardTitle className="text-lg font-semibold text-foreground">
          Interview History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {mockHistory.map((item, i) => (
          <div
            key={i}
            className="rounded-3xl border border-border bg-card p-5 transition-all hover:border-white/10"
          >
            <p className="text-base font-semibold text-foreground">
              {item.role}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary border border-primary/20">
                {item.score}
              </span>
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {item.date}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
