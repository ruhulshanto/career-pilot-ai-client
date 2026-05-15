"use client";

import { useEffect, useState } from "react";
import { Bell, BriefcaseBusiness, CalendarClock, Map, MessageCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useToast } from "@/shared/hooks/use-toast";

type NotificationPreferences = {
  emailNotifications: boolean;
  roadmapReminders: boolean;
  interviewReminders: boolean;
  jobAlerts: boolean;
  mentoringReminders: boolean;
};

const defaultPreferences: NotificationPreferences = {
  emailNotifications: true,
  roadmapReminders: true,
  interviewReminders: true,
  jobAlerts: true,
  mentoringReminders: true,
};

const storageKey = "career-ai-notification-preferences";

const preferenceItems = [
  {
    key: "emailNotifications",
    icon: Bell,
    title: "Email notifications",
    description: "Receive important account and career updates by email.",
  },
  {
    key: "roadmapReminders",
    icon: Map,
    title: "Roadmap reminders",
    description: "Get nudges for overdue milestones and next learning tasks.",
  },
  {
    key: "interviewReminders",
    icon: CalendarClock,
    title: "Interview reminders",
    description: "Receive reminders before scheduled practice interviews.",
  },
  {
    key: "jobAlerts",
    icon: BriefcaseBusiness,
    title: "Job alerts",
    description: "Get notified when new role matches are available.",
  },
  {
    key: "mentoringReminders",
    icon: MessageCircle,
    title: "Mentoring reminders",
    description: "Receive weekly prompts to continue your mentoring progress.",
  },
] as const;

export function NotificationsSettings() {
  const { toast } = useToast();
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(defaultPreferences);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      try {
        setPreferences({ ...defaultPreferences, ...JSON.parse(raw) });
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
    setLoaded(true);
  }, []);

  const setPreference = (key: keyof NotificationPreferences) => {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const savePreferences = () => {
    window.localStorage.setItem(storageKey, JSON.stringify(preferences));
    toast({
      variant: "success",
      title: "Notification preferences saved",
      description: "Your reminder settings have been updated.",
    });
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Bell className="h-5 w-5 text-primary" />
          Notification preferences
        </CardTitle>
        <CardDescription>
          Choose which career reminders and updates should reach you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {preferenceItems.map((item) => {
          const enabled = preferences[item.key];
          return (
            <div
              key={item.key}
              className="flex flex-col gap-4 rounded-xl border border-border bg-background/40 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex gap-3">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant={enabled ? "default" : "outline"}
                className="w-full rounded-xl sm:w-28"
                onClick={() => setPreference(item.key)}
                disabled={!loaded}
              >
                {enabled ? "On" : "Off"}
              </Button>
            </div>
          );
        })}
        <div className="flex justify-end pt-2">
          <Button onClick={savePreferences}>Save preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
}
