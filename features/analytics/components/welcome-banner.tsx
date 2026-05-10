"use client";

import Link from "next/link";
import { ArrowRight, BrainCircuit, Radar, Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

interface WelcomeBannerProps {
  name: string;
}

export function WelcomeBanner({ name }: WelcomeBannerProps) {
  return (
    <Card className="border border-cyan-300/15 bg-cyan-300/[0.055] shadow-2xl shadow-cyan-950/30">
      <CardContent className="grid gap-8 p-8 md:p-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-200">
            <Sparkles className="h-4 w-4" />
            CareerAI active
          </div>

          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Your AI career operating system is ready, {name}.
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              Resume intelligence, interview coaching, job matching, and
              learning progress are synchronized into one career command center.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/dashboard/user/chat">
              <Button variant="default" size="lg" className="rounded-2xl gap-2">
                Ask CareerAI
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/user/resume">
              <Button variant="outline" size="lg" className="rounded-2xl">
                Analyze Resume
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Career Readiness
              </p>
              <p className="text-xs text-muted-foreground">
                Live AI confidence index
              </p>
            </div>
            <BrainCircuit className="h-5 w-5 text-cyan-300" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-semibold text-foreground">78</span>
            <span className="pb-2 text-sm text-cyan-200">/100</span>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" />
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm text-muted-foreground">
            <Radar className="h-4 w-4 text-cyan-300" />
            Next action: strengthen cloud deployment stories.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
