"use client";

import { Activity, Sparkles, Wand2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

const mockTelemetry = [
  {
    action: "Resume intelligence upgraded",
    target: "Senior Frontend Engineer profile now has stronger impact metrics.",
    time: "2h ago",
    status: "92 ATS",
    color: "primary",
  },
  {
    action: "Interview AI detected pattern",
    target: "System design answers need clearer tradeoff framing.",
    time: "5h ago",
    status: "+5 confidence",
    color: "secondary",
  },
  {
    action: "Roadmap adjusted",
    target: "Cloud deployment and leadership storytelling moved to priority.",
    time: "Yesterday",
    status: "Next sprint",
    color: "accent",
  },
];

export function TelemetryFeed() {
  return (
    <Card className="border border-white/10 bg-white/[0.055] shadow-xl shadow-black/20">
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border/70 px-6 py-5">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg font-semibold">
            AI Recommendations
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          View All
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {mockTelemetry.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 transition-colors hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center border",
                    item.color === "primary"
                      ? "bg-primary/10 border-primary/20 text-primary"
                      : item.color === "secondary"
                        ? "bg-secondary/10 border-secondary/20 text-secondary"
                        : "bg-accent/10 border-accent/20 text-accent",
                  )}
                >
                  {i === 0 ? (
                    <Wand2 className="w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{item.action}</p>
                  <p className="text-sm text-muted-foreground">{item.target}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "text-sm font-semibold mb-1",
                    item.color === "primary"
                      ? "text-primary"
                      : item.color === "secondary"
                        ? "text-secondary"
                        : "text-accent",
                  )}
                >
                  {item.status}
                </p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
