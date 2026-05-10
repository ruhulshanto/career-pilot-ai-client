"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  FileSearch,
  Gauge,
  MessageSquareText,
  Radar,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const insightCards = [
  {
    label: "Resume Intelligence",
    value: "92",
    detail: "ATS-ready score",
    icon: FileSearch,
  },
  {
    label: "Interview Signal",
    value: "84%",
    detail: "confidence trend",
    icon: MessageSquareText,
  },
  {
    label: "Role Match",
    value: "219",
    detail: "AI-ranked jobs",
    icon: BriefcaseBusiness,
  },
];

const commandItems = [
  "Analyze my resume for a Senior Frontend role",
  "Find missing cloud skills for Staff Engineer",
  "Generate a 30-day interview practice plan",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#060B18] pt-28 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.26),transparent_32%),linear-gradient(135deg,rgba(6,182,212,0.14),transparent_28%,rgba(124,58,237,0.16)_72%,transparent)]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-14 px-4 pb-20 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 shadow-lg shadow-cyan-500/10 backdrop-blur">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            AI career operating system for ambitious professionals
          </div>

          <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Build the career your resume has been trying to explain.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            CareerAI analyzes your resume, detects skill gaps, generates career
            roadmaps, coaches mock interviews, recommends jobs, and tracks your
            learning progress in one intelligent workspace.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-cyan-400 text-slate-950 hover:bg-cyan-300"
              >
                Launch CareerAI
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard/user">
              <Button
                size="lg"
                variant="outline"
                className="border-white/15 bg-white/5"
              >
                View AI Dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              "Resume scoring",
              "Interview coaching",
              "Career path planning",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm text-slate-300"
              >
                <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
          className="relative"
        >
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-3 shadow-2xl shadow-cyan-950/40 backdrop-blur-2xl">
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#09111F]">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">CareerAI Command</p>
                    <p className="text-xs text-slate-400">
                      Live career intelligence
                    </p>
                  </div>
                </div>
                <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">
                  online
                </div>
              </div>

              <div className="grid gap-4 p-5 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300">
                      <Search className="h-5 w-5 text-cyan-300" />
                      <span className="text-sm">Ask CareerAI anything...</span>
                    </div>
                    <div className="mt-4 space-y-2">
                      {commandItems.map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl bg-white/[0.04] px-4 py-3 text-sm text-slate-300"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.06] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">
                          Career Readiness
                        </p>
                        <p className="text-xs text-slate-400">
                          AI confidence index
                        </p>
                      </div>
                      <Gauge className="h-5 w-5 text-cyan-300" />
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs text-slate-300">
                      <span>Resume 92</span>
                      <span>Skills 76</span>
                      <span>Interview 84</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {insightCards.map((card) => (
                    <div
                      key={card.label}
                      className="rounded-3xl border border-white/10 bg-white/[0.05] p-5"
                    >
                      <div className="mb-5 flex items-center justify-between">
                        <card.icon className="h-5 w-5 text-violet-300" />
                        <span className="text-xs text-slate-400">
                          {card.detail}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{card.label}</p>
                      <p className="mt-2 text-3xl font-semibold">
                        {card.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Radar, label: "Skill gap radar" },
              { icon: Route, label: "Adaptive roadmaps" },
              { icon: TrendingUp, label: "Progress analytics" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-slate-300 backdrop-blur"
              >
                <item.icon className="h-4 w-4 text-cyan-300" />
                {item.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
