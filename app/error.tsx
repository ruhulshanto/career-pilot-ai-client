"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

export default function RootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <section className="w-full max-w-lg space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
          <AlertTriangle aria-hidden="true" className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            The app hit an unexpected error. Your session is still protected,
            and you can retry the current view.
          </p>
        </div>
        <Button onClick={reset} className="w-full sm:w-auto">
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          Retry
        </Button>
      </section>
    </main>
  );
}
