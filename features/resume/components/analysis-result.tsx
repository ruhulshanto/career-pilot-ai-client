"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, Route } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useWorkspaceBase } from "@/shared/hooks/use-workspace-base";
import { getWorkspaceHref } from "@/shared/lib/role-routing";
import type { ResumeWithFeedback } from "@/services/api/resume";

interface AnalysisResultProps {
  resume: ResumeWithFeedback;
  onReset: () => void;
}

export function AnalysisResult({ resume, onReset }: AnalysisResultProps) {
  const workspaceBase = useWorkspaceBase();
  const feedback = resume.aiFeedbacks[0];
  const analysis = feedback?.rawResponse;
  const score = analysis?.atsScore ?? feedback?.score ?? 0;
  const suggestions =
    analysis?.improvementSuggestions ?? feedback?.suggestions ?? [];
  const strengths = analysis?.strengths ?? feedback?.strengths ?? [];
  const weaknesses = analysis?.weaknesses ?? feedback?.weaknesses ?? [];
  const missingSkills = analysis?.missingSkills ?? [];
  const keywordGaps = analysis?.keywordGaps ?? [];
  const nextActions = analysis?.recommendedNextActions ?? [];

  if (resume.status === "FAILED" || feedback?.status === "FAILED") {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-6">
          <div className="mb-3 flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="font-semibold">Resume analysis failed</p>
          </div>
          <p className="text-sm text-muted-foreground">
            {feedback?.errorMessage ||
              "The AI pipeline could not complete this analysis."}
          </p>
        </div>
        <Button
          variant="outline"
          className="h-14 w-full rounded-3xl font-semibold"
          onClick={onReset}
        >
          Try Another Resume
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  ATS Compatibility Score
                </p>
                <h4 className="text-4xl font-semibold text-foreground">
                  {Math.round(score)}%
                </h4>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card text-xl font-semibold text-foreground">
                {score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : "D"}
              </div>
            </div>
            {analysis?.summary || feedback?.summary ? (
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {analysis?.summary ?? feedback?.summary}
              </p>
            ) : null}
            {typeof analysis?.roleFitScore === "number" ? (
              <p className="mt-3 text-sm text-accent">
                Role fit score: {Math.round(analysis.roleFitScore)}/100
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-border shadow-sm">
          <CardContent className="space-y-4 p-6">
            <p className="text-sm font-semibold text-foreground">Strengths</p>
            <div className="space-y-3">
              {strengths.map((s: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-3xl border border-accent/20 bg-accent/10 p-4 text-sm text-accent"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
              {strengths.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No strengths identified yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardContent className="space-y-4 p-6">
            <p className="text-sm font-semibold text-foreground">Weaknesses</p>
            <div className="space-y-3">
              {weaknesses.map((s: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-3xl border border-primary/20 bg-primary/10 p-4 text-sm text-primary"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
              {weaknesses.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No weaknesses identified.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <InsightCard title="Improvement Suggestions" items={suggestions} />
        <InsightCard title="Missing Skills" items={missingSkills} />
        <InsightCard title="Keyword Gaps" items={keywordGaps} />
      </div>

      {nextActions.length > 0 && (
        <InsightCard title="Recommended Next Actions" items={nextActions} />
      )}

      <Card className="border border-accent/20 bg-accent/[0.06] shadow-sm">
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent">
              <Route className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Next: generate your career roadmap
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Use this resume analysis to create a personalized milestone
                plan and track progress from the dashboard.
              </p>
            </div>
          </div>
          <Button asChild className="h-12 shrink-0 rounded-2xl">
            <Link href={getWorkspaceHref(workspaceBase, "roadmap")}>
              Generate Roadmap
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="h-14 w-full rounded-3xl font-semibold"
        onClick={onReset}
      >
        Analyze Another Resume
      </Button>
    </div>
  );
}

function InsightCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="space-y-4 p-6">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No items available.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={`${title}:${index}:${item}`}
                className="rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
