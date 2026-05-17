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
} from "lucide-react";
import { CareerPilotTrajectoryIcon } from "@/shared/components/icons/CareerPilotTrajectoryIcon";

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
    <section className="dark-workspace-bg relative overflow-hidden bg-background pt-20 text-foreground sm:pt-32">
      {/* ── Cinematic Backgrounds ── */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_90%)]" />
      
      {/* Dynamic Aurora Glows */}
      <div className="absolute left-[10%] top-[15%] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px] animate-pulse" />
      <div className="absolute right-[5%] top-[20%] h-[500px] w-[500px] rounded-full bg-accent/15 blur-[140px]" />
      
      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
        <div className="max-w-2xl">
          {/* ── Eyebrow Badge ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
          >
            <CareerPilotTrajectoryIcon className="h-4 w-4" />
            AI Career Operating System
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-balance text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            Navigate your career with AI precision
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground/90 sm:text-xl"
          >
            Experience the future of professional growth. Analyze your resume, 
            map your roadmap, and practice interviews in one unified workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Button asChild size="xl" className="group rounded-2xl px-8 shadow-xl shadow-primary/15 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Link href="/register">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-14 flex items-center gap-4 text-xs font-medium uppercase tracking-widest text-muted-foreground/50"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Private • Secure • Professional</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:mt-0"
          id="assistant"
        >
          {/* Glassmorphic Decoration */}
          <div className="absolute -inset-10 z-0 rounded-[3rem] bg-gradient-to-br from-primary/10 via-transparent to-accent/10 blur-3xl opacity-50" />
          
          <div className="relative z-10 transition-transform duration-500 hover:scale-[1.01]">
             <HomepageAssistant />
          </div>

          {/* Floating Aesthetic Elements */}
          <motion.div 
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-8 -top-8 hidden h-24 w-24 rounded-3xl border border-border/40 bg-card/60 p-4 shadow-2xl backdrop-blur-xl lg:flex lg:flex-col lg:justify-between"
          >
            <div className="h-2 w-1/2 rounded-full bg-primary/30" />
            <div className="h-2 w-full rounded-full bg-primary/10" />
            <div className="h-2 w-3/4 rounded-full bg-primary/10" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -left-12 -bottom-10 hidden h-32 w-32 rounded-3xl border border-border/30 bg-card/40 p-4 shadow-2xl backdrop-blur-lg lg:flex lg:flex-col lg:justify-center lg:gap-3"
          >
             <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <div className="h-2 w-12 rounded-full bg-accent/20" />
             </div>
             <div className="h-2 w-full rounded-full bg-foreground/5" />
             <div className="h-2 w-2/3 rounded-full bg-foreground/5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
