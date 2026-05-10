"use client";

import { Sparkles, AlertCircle, CheckCircle2, Inbox } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

const mockNotifications = [
  {
    icon: Sparkles,
    title: "Path Vector Re-calculated",
    desc: "The roadmap has been synchronized with recent industry activity and new role signals.",
    time: "2 hours ago",
    type: "info",
    unread: true,
  },
  {
    icon: CheckCircle2,
    title: "Analysis Protocol Complete",
    desc: "Your latest resume upload is now optimized for ATS and recruiter match scoring.",
    time: "Yesterday",
    type: "success",
    unread: false,
  },
  {
    icon: AlertCircle,
    title: "System Access Event",
    desc: "A new sign-in occurred from an unrecognized location and has been logged securely.",
    time: "2 days ago",
    type: "warning",
    unread: false,
  },
];

export function NotificationList() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Inbox className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Incoming Telemetry
            </p>
            <p className="text-sm text-muted-foreground">
              Recent updates and alerts for your dashboard.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="rounded-2xl">
          Clear All
        </Button>
      </div>

      <div className="grid gap-4">
        {mockNotifications.map((item, i) => (
          <Card
            key={i}
            className={cn(
              "border border-border shadow-sm transition-all hover:border-white/20",
              item.unread ? "bg-[#111827]" : "bg-card",
            )}
          >
            <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-3xl border",
                  item.type === "info"
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : item.type === "success"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      : "border-orange-500/20 bg-orange-500/10 text-orange-400",
                )}
              >
                <item.icon className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    {item.time}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {item.desc}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={cn(
                      "h-1.5 flex-1 rounded-full",
                      item.type === "info"
                        ? "bg-primary/30"
                        : item.type === "success"
                          ? "bg-emerald-500/30"
                          : "bg-orange-500/30",
                    )}
                  />
                  <span className="h-1.5 w-8 rounded-full bg-white/5" />
                </div>
              </div>

              {item.unread && (
                <div className="h-3 w-3 rounded-full bg-primary" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
