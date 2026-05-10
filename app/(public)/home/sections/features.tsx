"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  FileSearch,
  GraduationCap,
  Layers3,
  MessageSquareText,
  PenLine,
  Route,
  ShieldCheck,
  Target,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

const modules = [
  {
    icon: FileSearch,
    title: "Resume Intelligence",
    desc: "Score ATS readiness, rewrite weak bullets, detect missing keywords, and compare your resume against target roles.",
  },
  {
    icon: Target,
    title: "Skill Gap Detection",
    desc: "Map current skills against real job requirements and prioritize the next highest-impact learning moves.",
  },
  {
    icon: Route,
    title: "Career Roadmaps",
    desc: "Generate milestone-based career plans with status, priority, deadlines, and role-specific recommendations.",
  },
  {
    icon: MessageSquareText,
    title: "AI Mock Interviews",
    desc: "Practice behavioral and technical interviews with performance signals, coaching notes, and confidence trends.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Job Recommendations",
    desc: "Rank job opportunities by fit, salary signal, skill overlap, resume match, and growth potential.",
  },
  {
    icon: PenLine,
    title: "Cover Letter Studio",
    desc: "Create tailored cover letters that connect your experience to the job description and company context.",
  },
];

const workflow = [
  "Upload resume",
  "CareerAI builds your profile graph",
  "Skill gaps and role matches are scored",
  "Roadmap, interviews, and job actions update live",
];

export function Features() {
  return (
    <section className="relative bg-[#060B18] px-4 py-28 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(6,182,212,0.08),transparent)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-4 py-2 text-sm text-violet-100">
            <BrainCircuit className="h-4 w-4" />
            Built for every stage of modern career growth
          </div>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            One intelligent workspace for resume, skills, interviews, jobs, and
            learning.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Inspired by the clarity of Linear, the speed of Vercel, and the
            assistant-first workflows of modern AI products.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: i * 0.04, duration: 0.45 }}
              className="group rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-xl shadow-black/20 backdrop-blur-xl transition hover:border-cyan-300/30 hover:bg-white/[0.075]"
            >
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 shadow-lg shadow-cyan-500/10">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-7 backdrop-blur-xl">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-400/15 text-violet-200">
                <Layers3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Career operating loop</h3>
                <p className="text-sm text-slate-400">
                  From profile to progress
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {workflow.map((step, index) => (
                <div key={step} className="grid grid-cols-[40px_1fr] gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm text-cyan-200">
                    {index + 1}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.055] p-7 backdrop-blur-xl">
            <div className="mb-7 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">
                  Skill Analytics Matrix
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  AI-prioritized growth areas
                </p>
              </div>
              <BarChart3 className="h-6 w-6 text-cyan-200" />
            </div>

            <div className="space-y-5">
              {[
                ["React / Next.js", 92, "strong"],
                ["System design", 74, "improve"],
                ["Cloud deployment", 61, "priority"],
                ["Leadership stories", 68, "practice"],
              ].map(([label, value, status]) => (
                <div key={label as string}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>{label}</span>
                    <span
                      className={cn(
                        "text-slate-400",
                        status === "priority" && "text-cyan-200",
                      )}
                    >
                      {status as string}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Bot, label: "AI coach" },
                { icon: ShieldCheck, label: "Private" },
                { icon: GraduationCap, label: "Learning" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-slate-300"
                >
                  <item.icon className="mb-3 h-5 w-5 text-cyan-200" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
