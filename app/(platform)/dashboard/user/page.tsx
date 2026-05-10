"use client";

import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { AnalyticsCards } from "@/features/analytics/components/analytics-cards";
import { ResumeUploadPanel } from "@/features/resume/components/resume-upload-panel";
import { WelcomeBanner } from "@/features/analytics/components/welcome-banner";
import { TelemetryFeed } from "@/features/analytics/components/telemetry-feed";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Activity,
  BarChart3,
  Calendar,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";

export default function UserDashboardPage() {
  return (
    <DashboardShell
      title="Dashboard"
      description="A concise view of your career metrics, recommended actions, and recent activity."
      actions={
        <Button variant="outline" size="sm" className="rounded-2xl">
          View Insights
        </Button>
      }
    >
      <div className="space-y-10">
        <WelcomeBanner name="Alex" />

        <AnalyticsCards />

        <div
          id="skill-analytics"
          className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"
        >
          <Card className="border border-white/10 bg-white/[0.055] shadow-xl shadow-black/20">
            <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border/70 px-6 py-5">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Skill Analytics
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  AI-prioritized gaps for your next target roles.
                </p>
              </div>
              <BarChart3 className="h-5 w-5 text-cyan-300" />
            </CardHeader>
            <CardContent className="space-y-5 p-6">
              {[
                ["React architecture", 92],
                ["System design", 74],
                ["Cloud deployment", 61],
                ["Leadership stories", 68],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-foreground">{label}</span>
                    <span className="text-muted-foreground">{value}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-cyan-300/15 bg-cyan-300/[0.055] shadow-xl shadow-black/20">
            <CardHeader className="border-b border-border/70 px-6 py-5">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                <Lightbulb className="h-5 w-5 text-cyan-300" />
                Career Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {[
                "Tailor your summary toward cloud-native frontend platforms.",
                "Add measurable product impact to two resume bullets.",
                "Practice one system-design interview before applying to Staff roles.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-muted-foreground"
                >
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.6fr_0.9fr]">
          <div className="space-y-8">
            <TelemetryFeed />

            <div className="grid gap-8 md:grid-cols-2">
              <ResumeUploadPanel />
              <Card className="border border-border shadow-sm">
                <CardHeader className="flex items-center gap-3 border-b border-border/70 px-6 py-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base font-semibold">
                    Interview Practice
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4 p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/5 border border-border">
                    <Activity className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground max-w-[220px]">
                    Practice interviews and improve your skills.
                  </p>
                  <Button variant="outline" className="rounded-2xl h-11 px-5">
                    Start Practice
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="border border-border shadow-sm">
            <CardHeader className="flex items-center justify-between gap-3 border-b border-border/70 px-6 py-5">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  AI Career Chat
                </h3>
                <p className="text-sm text-muted-foreground">
                  Open a session for faster career guidance and question-driven
                  support.
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Use the AI assistant to generate resume bullet points,
                  practice interview answers, or explore career opportunities.
                </p>
                <Button variant="default" className="w-full rounded-2xl h-12">
                  Open AI Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
