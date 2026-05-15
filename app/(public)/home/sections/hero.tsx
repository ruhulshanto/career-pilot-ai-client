"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileSearch,
  MessageSquareText,
  Route,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { HomepageAssistant } from "../components/homepage-assistant";

const productSignals = [
  { icon: FileSearch, label: "Resume analysis" },
  { icon: Route, label: "Career roadmap" },
  { icon: MessageSquareText, label: "Interview coaching" },
  { icon: BriefcaseBusiness, label: "Job tracking" },
] as const;

export function Hero() {
  return (
    <section className="dark-workspace-bg relative overflow-hidden bg-background pt-28 text-foreground">
      <div className="absolute inset-x-0 top-0 h-px bg-border/80" />
      <div className="absolute inset-0 bg-grid-pattern" />
      <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-14 px-4 pb-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            AI-powered career operating system
          </div>

          <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Turn career uncertainty into a guided plan.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
            Career Pilot AI connects resume analysis, skill gaps, roadmaps,
            interview practice, job tracking, and an AI copilot into one focused
            workspace for modern professionals.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/register">
                Start Your Career Roadmap
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border/80 bg-card/70"
            >
              <Link href="/explore">Explore the Product</Link>
            </Button>
          </div>

          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-2">
            {productSignals.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-lg border border-border/70 bg-card/50 px-4 py-3 text-sm text-muted-foreground"
              >
                <item.icon className="h-4 w-4 text-accent" />
                {item.label}
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-accent" />
            Honest job-search assistance, private uploads, and realistic AI
            workflows.
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
          className="relative"
          id="assistant"
        >
          <HomepageAssistant />
        </motion.div>
      </div>
    </section>
  );
}
