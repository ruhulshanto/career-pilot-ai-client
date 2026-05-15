"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarClock,
  CheckSquare,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { formatRelativeTime } from "../utils/dashboard-format";
import type { DashboardSummary } from "../types/dashboard";

const iconByType = {
  UPCOMING_INTERVIEW: CalendarClock,
  NEXT_ROADMAP_TASK: CheckSquare,
  NEWEST_JOB_MATCHES: BriefcaseBusiness,
  CAREER_MENTORING: MessageCircle,
} as const;

export function DashboardReminderCards({
  reminders,
}: {
  reminders: DashboardSummary["reminders"];
}) {
  if (!reminders?.length) return null;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Reminders
        </h2>
        <p className="text-sm text-muted-foreground">
          Timely prompts based on your roadmap, interviews, matches, and mentoring context.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {reminders.map((reminder) => {
          const Icon = iconByType[reminder.type];

          return (
            <Card key={reminder.id}>
              <CardHeader className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  {reminder.dueAt ? (
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(reminder.dueAt)}
                    </span>
                  ) : null}
                </div>
                <CardTitle className="text-base font-semibold">
                  {reminder.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 p-5 pt-0">
                <p className="min-h-[60px] text-sm leading-6 text-muted-foreground">
                  {reminder.description}
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href={reminder.actionLink}>{reminder.actionLabel}</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
