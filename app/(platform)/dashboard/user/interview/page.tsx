"use client";

import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Star } from "lucide-react";
import { InterviewSimulationCard } from "@/features/interview/components/simulation-card";
import { InterviewHistory } from "@/features/interview/components/interview-history";

export default function InterviewPage() {
  return (
    <DashboardShell title="Interview Practice">
      <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
        <InterviewSimulationCard />

        <div className="space-y-8">
          <InterviewHistory />

          <Card className="border border-border shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between gap-4">
                <Star className="w-8 h-8 text-primary" />
                <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                  Premium
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Upgrade to Premium
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Access advanced interview simulations and detailed performance
                  analytics.
                </p>
              </div>
              <Button className="w-full h-11 rounded-2xl">Upgrade Plan</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
