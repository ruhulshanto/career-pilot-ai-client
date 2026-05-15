"use client";

import { Info } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

export function WalkthroughTip({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="border border-accent/15 bg-accent/[0.04] shadow-sm">
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent">
          <Info className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
