"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

export default function PlatformError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Platform workspace error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <section className="w-full max-w-xl rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
          <AlertTriangle aria-hidden="true" className="h-5 w-5" />
        </div>
        <h1 className="text-lg font-semibold tracking-tight">
          We could not load this workspace
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {error.message || "Refresh this section to request fresh data for the current account."}
        </p>
        <Button onClick={reset} className="mt-6 w-full sm:w-auto">
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          Try again
        </Button>
      </section>
    </main>
  );
}
