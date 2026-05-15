"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  Gauge,
  Layers3,
  MessageSquareText,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

const capabilities = [
  {
    icon: FileSearch,
    title: "Resume Analysis",
    description: "Parse resumes, surface weak sections, and translate experience into role-specific proof.",
  },
  {
    icon: Gauge,
    title: "ATS Feedback",
    description: "Score clarity, keywords, structure, and missing evidence before applications go out.",
  },
  {
    icon: Route,
    title: "Career Roadmaps",
    description: "Convert a target role into milestones, projects, skills, and weekly next actions.",
  },
  {
    icon: MessageSquareText,
    title: "Interview Coaching",
    description: "Practice answers, review feedback, and improve technical plus behavioral readiness.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Job Search Assistant",
    description: "Create honest search links, compare job descriptions, and track applications safely.",
  },
  {
    icon: Target,
    title: "Skill Gap Analysis",
    description: "Prioritize the missing skills that matter most for the role you actually want.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "See progress from real resume, roadmap, interview, and application activity.",
  },
  {
    icon: Bot,
    title: "AI Career Copilot",
    description: "Ask targeted career questions and turn fuzzy goals into concrete next moves.",
  },
] as const;

const workflow = [
  { label: "Upload Resume", detail: "PDF, DOCX, or TXT private upload" },
  { label: "Analyze Skills", detail: "ATS, strengths, gaps, and evidence" },
  { label: "Build Roadmap", detail: "Milestones and projects for the target role" },
  { label: "Prepare Interviews", detail: "Practice questions and feedback loops" },
  { label: "Track Applications", detail: "Saved, applied, interviewing, offer, rejected" },
  { label: "Improve Growth", detail: "Dashboard signals guide the next action" },
] as const;

const dashboardCards = [
  {
    title: "Next best action",
    value: "Tailor resume for target role",
    detail: "Based on latest resume and roadmap activity",
  },
  {
    title: "Roadmap focus",
    value: "Portfolio proof",
    detail: "Current milestone emphasizes measurable project outcomes",
  },
  {
    title: "Application pipeline",
    value: "Interviewing",
    detail: "Track real roles from job boards and company pages",
  },
] as const;

const resumeFindings = [
  "Summary is clear but should name one target role.",
  "Project bullets need measurable outcomes and scope.",
  "Missing keywords: accessibility, performance, testing.",
] as const;

const philosophy = [
  "Built around honest job-search assistance instead of unsafe scraping.",
  "Designed for real user progress: resumes, roadmaps, interviews, and applications stay connected.",
  "Security-first defaults: private uploads, cookie-based auth, production email, and clear health checks.",
] as const;

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
        <Sparkles className="h-4 w-4" />
        {eyebrow}
      </div>
      <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
        {description}
      </p>
    </div>
  );
}

function ProductCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card shadow-sm shadow-elevation/5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Features() {
  return (
    <>
      <section id="features" className="bg-background px-4 py-24 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Product capabilities"
            title="Everything a career workspace should connect."
            description="Career Pilot AI is not a pile of disconnected tools. Each capability feeds the next step in the user's career workflow."
          />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {capabilities.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.025, duration: 0.4 }}
              >
                <ProductCard className="h-full p-6 transition-colors hover:border-primary/35">
                  <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </ProductCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="border-y border-border/80 bg-muted/20 px-4 py-24 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Career workflow"
            title="A guided product flow from resume to momentum."
            description="The public promise is simple: upload, understand, plan, practice, track, and improve."
          />

          <ProductCard className="overflow-hidden">
            <div className="grid divide-y divide-border/80 lg:grid-cols-6 lg:divide-x lg:divide-y-0">
              {workflow.map((step, index) => (
                <div key={step.label} className="relative p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                    {index < workflow.length - 1 && (
                      <ArrowRight className="hidden h-4 w-4 text-muted-foreground lg:block" />
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {step.label}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </ProductCard>
        </div>
      </section>

      <section id="dashboard-preview" className="bg-background px-4 py-24 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              <Layers3 className="h-4 w-4" />
              Dashboard preview
            </div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              A workspace that shows what to do next.
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
              The dashboard is designed around real activity: resume analyses,
              roadmap progress, interview practice, job tracking, and AI usage.
            </p>
          </div>

          <ProductCard className="p-4 sm:p-5">
            <div className="rounded-lg border border-border/80 bg-background/50">
              <div className="flex items-center justify-between border-b border-border/80 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">Career Command Center</p>
                  <p className="text-xs text-muted-foreground">
                    Example product view
                  </p>
                </div>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  live signals
                </span>
              </div>
              <div className="grid gap-4 p-4 md:grid-cols-3">
                {dashboardCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-lg border border-border/80 bg-card p-4"
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {card.title}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-foreground">
                      {card.value}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {card.detail}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 border-t border-border/80 p-4 md:grid-cols-[1fr_0.8fr]">
                <div className="rounded-lg border border-primary/15 bg-primary/10 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold">Roadmap progress</p>
                    <Route className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-3">
                    {["Profile clarity", "Portfolio project", "Interview practice"].map((item, index) => (
                      <div key={item} className="flex items-center gap-3">
                        <CheckCircle2
                          className={cn(
                            "h-4 w-4",
                            index === 0 ? "text-accent" : "text-muted-foreground",
                          )}
                        />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-border/80 bg-card p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold">AI insight</p>
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Your strongest next move is to align resume evidence with
                    the role you are actively targeting.
                  </p>
                </div>
              </div>
            </div>
          </ProductCard>
        </div>
      </section>

      <section id="resume-analysis" className="border-y border-border/80 bg-muted/20 px-4 py-24 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <ProductCard className="p-5">
            <div className="rounded-lg border border-border/80 bg-background/50 p-5">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">Sample Resume Analysis</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    How the product explains strengths, gaps, and next edits
                  </p>
                </div>
                <div className="rounded-lg border border-accent/20 bg-accent/10 px-4 py-3 text-center">
                  <p className="text-xs text-muted-foreground">ATS score</p>
                  <p className="text-2xl font-semibold text-foreground">82/100</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border/80 bg-card p-4">
                  <p className="mb-4 text-sm font-semibold">Strengths</p>
                  <div className="space-y-3">
                    {["Clear frontend project signal", "Relevant JavaScript stack", "Good role alignment"].map((item) => (
                      <div key={item} className="flex gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-border/80 bg-card p-4">
                  <p className="mb-4 text-sm font-semibold">Needs work</p>
                  <div className="space-y-3">
                    {resumeFindings.map((item) => (
                      <div key={item} className="flex gap-2 text-sm text-muted-foreground">
                        <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-primary/15 bg-primary/10 p-4">
                <p className="text-sm font-semibold">AI recommendation</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Lead with a target-role summary, then rewrite each project
                  bullet around action, scope, metric, and business outcome.
                </p>
              </div>
            </div>
          </ProductCard>

          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <ClipboardCheck className="h-4 w-4" />
              Resume + AI analysis
            </div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Useful feedback, not vague resume tips.
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
              Career Pilot AI makes resume feedback operational: what is strong,
              what is missing, and what should be edited before the next
              application.
            </p>
          </div>
        </div>
      </section>

      <section id="philosophy" className="bg-background px-4 py-24 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Product philosophy"
            title="Built for modern professionals, not demo theater."
            description="The public experience is intentionally honest: practical AI workflows, realistic job search, and clear user value."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {philosophy.map((item) => (
              <ProductCard key={item} className="p-6">
                <ShieldCheck className="mb-5 h-6 w-6 text-accent" />
                <p className="text-sm leading-7 text-muted-foreground">{item}</p>
              </ProductCard>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="px-4 pb-24 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ProductCard className="relative overflow-hidden p-8 sm:p-10 lg:p-12">
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-semibold text-accent">
                  Ready for the real workspace?
                </p>
                <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
                  Start with your resume. Leave with a career plan.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                  Create a workspace to save analysis, generate roadmaps,
                  practice interviews, and track job progress over time.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button asChild size="lg">
                  <Link href="/register">
                    Analyze Your Resume
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/explore">Explore Career Pilot AI</Link>
                </Button>
              </div>
            </div>
          </ProductCard>
        </div>
      </section>
    </>
  );
}
