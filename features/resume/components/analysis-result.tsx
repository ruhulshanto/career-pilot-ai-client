"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

interface AnalysisResultProps {
  result: any;
  onReset: () => void;
}

export function AnalysisResult({ result, onReset }: AnalysisResultProps) {
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
                  {result.score || 0}%
                </h4>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-[#111827] text-xl font-semibold text-foreground">
                A
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-border shadow-sm">
          <CardContent className="space-y-4 p-6">
            <p className="text-sm font-semibold text-foreground">Strengths</p>
            <div className="space-y-3">
              {(result.strengths || []).map((s: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
              {(!result.strengths || result.strengths.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  No strengths identified yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardContent className="space-y-4 p-6">
            <p className="text-sm font-semibold text-foreground">Suggestions</p>
            <div className="space-y-3">
              {(result.suggestions || []).map((s: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-3xl border border-orange-500/20 bg-orange-500/10 p-4 text-sm text-orange-200"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
              {(!result.suggestions || result.suggestions.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  No suggestions available.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Button
        variant="outline"
        className="w-full rounded-3xl h-14 font-semibold"
        onClick={onReset}
      >
        Analyze Another Resume
      </Button>
    </div>
  );
}
