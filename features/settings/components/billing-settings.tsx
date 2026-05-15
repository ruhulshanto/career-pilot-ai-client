"use client";

import { ArrowUpRight, CreditCard, FileText, Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export function BillingSettings() {
  return (
    <div className="space-y-8">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <CreditCard className="h-5 w-5 text-primary" />
            Current plan
          </CardTitle>
          <CardDescription>
            Billing is ready for future subscriptions and premium AI usage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 rounded-2xl border border-border bg-background/40 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active subscription</p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight">Free plan</h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Includes resume analysis, roadmap planning, interview practice, and basic AI mentoring limits.
              </p>
            </div>
            <Button className="gap-2 md:self-start" disabled>
              Billing not enabled
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              AI usage
            </CardTitle>
            <CardDescription>Usage metering will activate when premium plans are enabled.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-dashed border-border p-6 text-center">
              <p className="text-sm font-semibold">No billable usage yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Free workspace activity is tracked in your dashboard analytics.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Invoices
            </CardTitle>
            <CardDescription>Payment history will appear here after billing is enabled.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-dashed border-border p-6 text-center">
              <p className="text-sm font-semibold">No invoices yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Future receipts and payment history will be listed here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Future premium plan</CardTitle>
          <CardDescription>
            Prepared space for premium AI limits, advanced portfolio analytics, and priority mentoring.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {["Higher AI limits", "Advanced job matching", "Portfolio analytics"].map((feature) => (
              <div key={feature} className="rounded-xl border border-border bg-background/40 p-4 text-sm font-medium">
                {feature}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
