"use client";

import { Play, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

export function InterviewSimulationCard() {
  return (
    <Card className="lg:col-span-2 h-full border border-border shadow-sm">
      <CardContent className="p-8 lg:p-10 flex h-full flex-col justify-between">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 rounded-3xl border border-primary/20 bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-primary" />
            </div>
          </div>

          <h2 className="text-3xl font-semibold mb-4 text-foreground">
            Start Interview Practice
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground max-w-lg mb-8">
            Practice with AI-powered interviewers. Choose your role and get
            real-time feedback.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Button size="lg" className="rounded-2xl gap-2">
            <Play className="w-5 h-5" />
            Start Practice
          </Button>
          <Button size="lg" variant="outline" className="rounded-2xl">
            Choose Role
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
