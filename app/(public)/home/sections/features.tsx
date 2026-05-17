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
  Target,
} from "lucide-react";
import { CareerPilotTrajectoryIcon } from "@/shared/components/icons/CareerPilotTrajectoryIcon";

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
  {
    title: "Honest Assistance",
    detail: "Built around real career support instead of unsafe automation or fragile web scraping.",
    icon: ShieldCheck,
  },
  {
    title: "Unified Progress",
    detail: "Resumes, roadmaps, interviews, and applications stay connected in one cohesive workspace.",
    icon: Layers3,
  },
  {
    title: "Security Defaults",
    detail: "Private uploads, production-grade security, and transparent data practices by design.",
    icon: CheckCircle2,
  },
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
        <CareerPilotTrajectoryIcon className="h-4 w-4" />
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

      <section id="workflow" className="relative border-y border-border/50 bg-muted/30 px-4 py-24 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Career Workflow"
            title="A guided product flow from resume to momentum."
            description="The public promise is simple: upload, understand, plan, practice, track, and improve. A unified workspace for modern growth."
          />

          <div className="relative mt-16">
            {/* Connecting Line (Desktop) */}
            <div className="absolute left-0 top-[45px] hidden h-px w-full bg-gradient-to-r from-transparent via-border to-transparent lg:block" />
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
              {workflow.map((step, index) => (
                <div key={step.label} className="group relative flex flex-col items-center text-center lg:items-start lg:text-left">
                  {/* Step Number Badge */}
                  <div className="relative z-10 mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-border/80 bg-background text-sm font-bold text-primary shadow-sm transition-transform group-hover:scale-110">
                    {index + 1}
                  </div>
                  
                  <div className="space-y-3 px-2">
                    <h3 className="text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {step.label}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <Button asChild variant="outline" className="rounded-full border-primary/20 bg-primary/5 text-primary hover:bg-primary/10">
               <Link href="/register" className="gap-2">
                 Begin your first flow <ArrowRight className="h-4 w-4" />
               </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="dashboard-preview" className="bg-background px-4 py-24 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Layers3 className="h-4 w-4" />
              Product Intelligence
            </div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              A workspace that shows what to do next.
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
              Our dashboard is built around your real career activity: resume analysis,
              roadmap progress, interview practice, and job tracking.
            </p>
          </div>

          <ProductCard className="p-4 sm:p-5 border-border/60 shadow-xl shadow-primary/5">
            <div className="rounded-xl border border-border/60 bg-background/50 overflow-hidden">
              <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-6 py-4">
                <div className="flex items-center gap-4">
                  {/* macOS style window controls for that premium 'app' feel */}
                  <div className="hidden flex-row gap-1.5 sm:flex">
                    <div className="h-2.5 w-2.5 rounded-full bg-border/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-border/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-border/60" />
                  </div>
                  <div className="h-4 w-px bg-border/50 hidden sm:block mx-1" />
                  <div>
                    <h4 className="text-sm font-bold tracking-tight text-foreground">Career Command Center</h4>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70">
                      Unified Dashboard
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2">
                  <div className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Live Signals</span>
                </div>
              </div>
              
              <div className="grid gap-4 p-5 md:grid-cols-3">
                {dashboardCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-primary/30"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {card.title}
                    </p>
                    <p className="mt-4 text-sm font-bold text-foreground">
                      {card.value}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {card.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 border-t border-border/50 p-5 md:grid-cols-[1fr_0.8fr] bg-muted/5">
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-bold text-foreground">Roadmap Progress</p>
                    <Route className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-3">
                    {["Profile clarity", "Portfolio project", "Interview practice"].map((item, index) => (
                      <div key={item} className="flex items-center gap-3">
                        <CheckCircle2
                          className={cn(
                            "h-4 w-4",
                            index === 0 ? "text-primary" : "text-muted-foreground/40",
                          )}
                        />
                        <span className="text-xs font-medium text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-bold text-foreground">AI Intelligence</p>
                    <CareerPilotTrajectoryIcon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Your strongest next move is to align resume evidence with
                    the role you are actively targeting.
                  </p>
                </div>
              </div>
            </div>
          </ProductCard>
        </div>
      </section>

      <section id="resume-analysis" className="border-y border-border/50 bg-muted/20 px-4 py-24 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <ProductCard className="p-4 sm:p-6 border-border/60 shadow-2xl shadow-primary/5">
            <div className="rounded-2xl border border-border/50 bg-background/60 p-5 sm:p-8 backdrop-blur-sm">
              <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ClipboardCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-foreground">Sample Analysis</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      Senior Frontend Engineer
                    </p>
                  </div>
                </div>
                <div className="inline-flex flex-col items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 px-6 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70 mb-1">ATS Optimization</p>
                  <p className="text-3xl font-black tracking-tighter text-primary">82<span className="text-lg opacity-40">/100</span></p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-border/40 bg-card/40 p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/80">Strengths</span>
                  </div>
                  <div className="space-y-3">
                    {["Clear frontend signal", "Relevant JS stack", "Role alignment"].map((item) => (
                      <div key={item} className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/30" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/40 bg-card/40 p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/80">Missing Evidence</span>
                  </div>
                  <div className="space-y-3">
                    {resumeFindings.map((item) => (
                      <div key={item} className="flex items-start gap-3 text-xs font-medium text-muted-foreground leading-relaxed">
                        <div className="mt-1.5 h-1 w-3 shrink-0 rounded-full bg-primary/20" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-inner">
                <div className="mb-3 flex items-center gap-2">
                   <CareerPilotTrajectoryIcon className="h-4 w-4 text-primary" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Strategic Advice</span>
                </div>
                <p className="text-xs font-medium leading-relaxed text-muted-foreground/90">
                  Lead with a target-role summary, then rewrite each project
                  bullet around action, scope, metric, and business outcome.
                </p>
              </div>
            </div>
          </ProductCard>

          <div className="lg:pl-6">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <ClipboardCheck className="h-4 w-4" />
              Resume + AI Analysis
            </div>
            <h2 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
              Useful feedback, not <span className="text-primary">vague resume tips.</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Career Pilot AI makes feedback operational: identifying exactly what is strong,
              what is missing, and the precise edits required before your next application.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
               <Button asChild size="lg" className="rounded-xl px-8 shadow-lg shadow-primary/20">
                  <Link href="/register">Try Free Analysis</Link>
               </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="philosophy" className="relative overflow-hidden bg-background px-4 py-24 text-foreground sm:px-6 lg:px-8">
        {/* Subtle background aesthetics */}
        <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
        
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Product Philosophy"
            title="Built for professionals, not demo theater."
            description="Our public experience is intentionally honest: focusing on practical AI workflows and clear, measurable user value."
          />
          
          <div className="grid gap-6 md:grid-cols-3">
            {philosophy.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <ProductCard className="group h-full p-8 transition-all duration-300 hover:border-primary/50 hover:bg-primary/[0.02] hover:shadow-2xl hover:shadow-primary/5">
                  <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground/80">
                    {item.detail}
                  </p>
                </ProductCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="relative px-4 pb-24 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ProductCard className="relative overflow-hidden border-primary/20 bg-card p-10 sm:p-16 lg:p-20 shadow-2xl shadow-primary/5">
            {/* ── Cinematic Backgrounds ── */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
            <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute -left-20 -bottom-20 h-[300px] w-[300px] rounded-full bg-accent/5 blur-[100px]" />

            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mb-8 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary"
              >
                <CareerPilotTrajectoryIcon className="h-4 w-4" />
                Ready to take control?
              </motion.div>

              <h2 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl">
                Start with your resume. <br className="hidden sm:block" />
                Leave with a <span className="bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">career plan.</span>
              </h2>

              <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground/90">
                Join thousands of professionals using Career Pilot AI to turn fuzzy goals into 
                concrete roadmaps. Your first resume analysis is on us.
              </p>

              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="xl" className="h-14 rounded-2xl px-10 text-base shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <Link href="/register" className="gap-2">
                    Analyze Your Resume <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="xl" variant="outline" className="h-14 rounded-2xl border-border/60 bg-background/50 px-10 text-base backdrop-blur-sm transition-all hover:bg-muted/50">
                  <Link href="/explore">Explore the Product</Link>
                </Button>
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                 <div className="flex items-center gap-2">
                   <ShieldCheck className="h-3 w-3" />
                   Private & Secure
                 </div>
                 <div className="flex items-center gap-2">
                   <CheckCircle2 className="h-3 w-3" />
                   Expert Backed
                 </div>
              </div>
            </div>
          </ProductCard>
        </div>
      </section>
    </>
  );
}
