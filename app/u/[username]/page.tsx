"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  Github,
  Linkedin,
  MapPin,
  Mail,
  Target,
  Star,
  User,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { profileApi, type CareerPortfolio } from "@/services/api/profile";
import { formatPreferredWorkMode } from "@/features/settings/lib/profile-payload";
import { getPublicImageUrl } from "@/shared/utils/image";
import { cn } from "@/shared/lib/utils";

export default function PublicCareerProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const portfolioQuery = useQuery({
    queryKey: ["public-profile", username],
    queryFn: () => profileApi.getPublicPortfolio(username),
    retry: 1,
  });

  if (portfolioQuery.isLoading) {
    return <PublicProfileSkeleton />;
  }

  if (!portfolioQuery.data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6 text-center text-foreground">
        <div className="max-w-md space-y-5 rounded-3xl border border-border/40 bg-card/50 p-10 shadow-2xl backdrop-blur-xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <User className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Unavailable</h1>
          <p className="text-muted-foreground leading-relaxed">
            This career portfolio is private, does not exist, or you do not have permission to view it.
          </p>
          <Button asChild className="mt-4 rounded-xl px-8" size="lg">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </main>
    );
  }

  return <PortfolioView portfolio={portfolioQuery.data} />;
}

function PublicProfileSkeleton() {
  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="h-56 md:h-72 w-full bg-muted/30 animate-pulse" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 sm:-mt-32 mb-10 flex flex-col md:flex-row gap-6 md:items-end">
          <div className="h-32 w-32 sm:h-40 sm:w-40 shrink-0 rounded-3xl border-4 border-background bg-muted/60 animate-pulse shadow-xl z-10" />
          <div className="flex-1 space-y-4 pb-4">
            <div className="h-10 w-64 bg-muted/50 animate-pulse rounded-lg" />
            <div className="h-6 w-96 max-w-full bg-muted/40 animate-pulse rounded-md" />
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="h-8 w-32 bg-muted/40 animate-pulse rounded-full" />
              <div className="h-8 w-40 bg-muted/40 animate-pulse rounded-full" />
            </div>
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <div className="h-48 bg-muted/20 animate-pulse rounded-3xl border border-border/30" />
            <div className="h-64 bg-muted/20 animate-pulse rounded-3xl border border-border/30" />
            <div className="h-64 bg-muted/20 animate-pulse rounded-3xl border border-border/30" />
          </div>
          <div className="space-y-6">
            <div className="h-40 bg-muted/20 animate-pulse rounded-3xl border border-border/30" />
            <div className="h-56 bg-muted/20 animate-pulse rounded-3xl border border-border/30" />
          </div>
        </div>
      </div>
    </main>
  );
}

function PortfolioView({ portfolio }: { portfolio: CareerPortfolio }) {
  const name = [portfolio.user.firstName, portfolio.user.lastName].filter(Boolean).join(" ");
  const links = portfolio.user.socialLinks ?? {};
  const isMentorProfile = portfolio.user.role === "MENTOR";

  return (
    <main className="min-h-screen bg-background text-foreground pb-24 selection:bg-primary/20">
      {/* Premium Cover Banner */}
      <div className="relative h-56 md:h-72 w-full overflow-hidden bg-muted/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Profile Header Overlapping Banner */}
        <div className="relative -mt-24 sm:-mt-32 mb-12 flex flex-col md:flex-row gap-6 md:items-end z-10">
          <div className="flex h-32 w-32 sm:h-40 sm:w-40 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-background bg-card shadow-2xl ring-1 ring-border/10">
            {portfolio.user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getPublicImageUrl(portfolio.user.avatarUrl) ?? ""}
                alt={name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <User className="h-14 w-14 text-muted-foreground/50" />
            )}
          </div>
          
          <div className="flex-1 pb-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                {name}
              </h1>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
                @{portfolio.user.username}
              </span>
              {isMentorProfile && (
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent border border-accent/20 flex items-center gap-1">
                  <Star className="h-3 w-3" /> Mentor
                </span>
              )}
            </div>
            
            <p className="mt-3 max-w-3xl text-lg sm:text-xl text-muted-foreground/90 font-medium leading-relaxed">
              {portfolio.user.headline ||
                (isMentorProfile
                  ? "Mentoring professionals through practical career growth."
                  : `Building toward ${portfolio.user.targetRole ?? "a stronger career path"}`)}
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium">
              {portfolio.user.currentPosition && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-4 py-1.5 border border-border/50 text-foreground/80 shadow-sm">
                  <BriefcaseBusiness className="h-4 w-4 text-primary" />
                  {portfolio.user.currentPosition}
                  {portfolio.user.currentCompany ? ` at ${portfolio.user.currentCompany}` : ""}
                </span>
              )}
              {portfolio.user.targetRole && !isMentorProfile && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-4 py-1.5 border border-border/50 text-foreground/80 shadow-sm">
                  <Target className="h-4 w-4 text-accent" />
                  Target: {portfolio.user.targetRole}
                </span>
              )}
              {portfolio.user.location && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-4 py-1.5 border border-border/50 text-foreground/80 shadow-sm">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                  {portfolio.user.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-8">
            
            {/* Story / Bio */}
            <Card className="overflow-hidden rounded-3xl border-border/40 bg-card/40 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
              <CardHeader className="bg-muted/10 border-b border-border/30 px-6 py-5">
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  {isMentorProfile ? "Mentor Background" : "Professional Story"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-[15px] leading-relaxed text-muted-foreground/90 whitespace-pre-wrap">
                    {portfolio.user.bio || 
                     portfolio.user.experienceSummary ||
                     "This professional is currently building their career portfolio. Check back later for updates."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Mentor Specific Details */}
            {isMentorProfile && (
              <Card className="overflow-hidden rounded-3xl border-border/40 bg-card/40 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
                <CardHeader className="bg-muted/10 border-b border-border/30 px-6 py-5">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Star className="h-5 w-5 text-accent" />
                    Areas of Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {(portfolio.user.mentorSpecialties ?? ["Roadmap reviews", "Interview readiness"]).map((specialty) => (
                        <span key={specialty} className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Industry Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {(portfolio.user.mentorExpertise ?? ["Career transitions", "Portfolio positioning"]).map((expertise) => (
                        <span key={expertise} className="rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
                          {expertise}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Experience & Projects */}
            <Card className="overflow-hidden rounded-3xl border-border/40 bg-card/40 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
              <CardHeader className="bg-muted/10 border-b border-border/30 px-6 py-5">
                <CardTitle className="text-xl flex items-center gap-2">
                  <BriefcaseBusiness className="h-5 w-5 text-emerald-500" />
                  Skills & Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                {portfolio.skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Core Competencies</h4>
                    <div className="flex flex-wrap gap-2.5">
                      {portfolio.skills.slice(0, 15).map((skill, index) => (
                        <span
                          key={`${skill.name}-${index}`}
                          className="rounded-xl border border-border/50 bg-background px-3 py-1.5 text-sm font-medium text-foreground/80 shadow-sm"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {portfolio.projects.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Featured Work</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      {portfolio.projects.slice(0, 4).map((project, index) => (
                        <div
                          key={`${project.title}-${index}`}
                          className="group rounded-2xl border border-border/50 bg-background/50 p-5 transition hover:bg-muted/30 hover:border-primary/30"
                        >
                          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
                          {project.description && (
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                              {project.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {portfolio.skills.length === 0 && portfolio.projects.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No skills or projects have been showcased yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Education & Certs */}
            <Card className="overflow-hidden rounded-3xl border-border/40 bg-card/40 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
              <CardHeader className="bg-muted/10 border-b border-border/30 px-6 py-5">
                <CardTitle className="text-xl flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-indigo-500" />
                  Education & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Education</h3>
                    {portfolio.user.education?.length ? (
                      <div className="space-y-4">
                        {portfolio.user.education.map((item, index) => (
                          <div key={index} className="relative pl-4 border-l-2 border-muted">
                            <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-primary/40" />
                            <p className="font-semibold text-foreground">
                              {String(item.degree ?? item.school ?? "Education")}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground/80">
                              {[item.school, item.year].filter(Boolean).join(" • ")}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Education details not listed.</p>
                    )}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Certifications</h3>
                    {portfolio.certifications.length ? (
                      <div className="space-y-4">
                        {portfolio.certifications.slice(0, 4).map((cert, index) => (
                          <div key={`${cert.title}-${index}`} className="relative pl-4 border-l-2 border-muted">
                            <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-accent/40" />
                            <p className="font-semibold text-foreground">{cert.title}</p>
                            {"issuer" in cert && cert.issuer && (
                              <p className="mt-1 text-sm text-muted-foreground/80">{String(cert.issuer)}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No certifications added.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Roadmap Progress */}
            {!isMentorProfile && (
              <Card className="overflow-hidden rounded-3xl border-border/40 bg-card/40 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
                <CardHeader className="bg-muted/10 border-b border-border/30 px-6 py-5">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Target className="h-5 w-5 text-accent" />
                    Career Roadmap Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-lg font-bold text-accent">{portfolio.stats.roadmapProgress}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-muted/50 border border-border/50">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-all duration-1000 ease-out"
                        style={{ width: `${portfolio.stats.roadmapProgress}%` }}
                      />
                    </div>
                  </div>
                  
                  {portfolio.roadmap?.completedMilestones.length ? (
                    <div className="grid gap-3 pt-2">
                      <h4 className="text-sm font-semibold text-foreground mb-1 uppercase tracking-wider">Completed Milestones</h4>
                      {portfolio.roadmap.completedMilestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex gap-4 rounded-2xl border border-border/50 bg-background/50 p-4"
                        >
                          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{milestone.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic border border-border/40 border-dashed rounded-xl p-4 text-center">
                      Milestones will appear here as roadmap work progresses.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <aside className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              {isMentorProfile ? (
                <>
                  <StatCard
                    label="Rating"
                    value={typeof portfolio.user.mentorRating === "number" ? portfolio.user.mentorRating.toFixed(1) : "New"}
                    icon={<Star className="h-4 w-4 text-yellow-500" />}
                  />
                  <StatCard
                    label="Reviews"
                    value={portfolio.user.mentorCompletedReviews ?? 0}
                    icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                  />
                </>
              ) : (
                <>
                  <StatCard label="Readiness" value={`${portfolio.stats.interviewReadiness}%`} icon={<Target className="h-4 w-4 text-accent" />} />
                  <StatCard label="ATS Score" value={`${portfolio.stats.atsScore}%`} icon={<Award className="h-4 w-4 text-primary" />} />
                </>
              )}
            </div>

            {/* Links Section - Preserved Design */}
            <Card className="border border-border shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-muted/10 border-b border-border/30">
                <CardTitle>Links</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 p-5">
                <ProfileLink href={links.linkedin} label="LinkedIn" icon="linkedin" />
                <ProfileLink href={links.github} label="GitHub" icon="github" />
                <ProfileLink href={links.portfolio || links.website} label="Portfolio" />
                {portfolio.user.email && (
                  <Button asChild variant="outline" className="h-10 justify-start rounded-lg mt-2 border-primary/20 hover:bg-primary/5 text-primary hover:text-primary">
                    <a href={`mailto:${portfolio.user.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Me
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="border border-border/40 shadow-sm rounded-3xl overflow-hidden bg-card/40 backdrop-blur-sm">
              <CardHeader className="bg-muted/10 border-b border-border/30">
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-5 text-sm">
                {portfolio.user.yearsExperience !== null && portfolio.user.yearsExperience !== undefined && (
                  <Preference label="Experience" value={`${portfolio.user.yearsExperience} years`} />
                )}
                <Preference label="Job type" value={portfolio.user.preferredJobType} />
                <Preference
                  label="Work mode"
                  value={formatPreferredWorkMode(portfolio.user.preferredWorkMode)}
                />
                <Preference label="Salary" value={portfolio.user.preferredSalaryRange} />
                {portfolio.user.languages?.length ? (
                  <div>
                    <p className="font-semibold text-foreground/90 mb-2">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {portfolio.user.languages.map((language) => (
                        <span key={language} className="rounded-full bg-muted/50 px-3 py-1 text-[11px] font-medium uppercase tracking-wider">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border border-border/40 shadow-sm rounded-3xl overflow-hidden bg-card/40 backdrop-blur-sm">
              <CardHeader className="bg-muted/10 border-b border-border/30">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {portfolio.achievements.length ? (
                  portfolio.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="rounded-xl border border-border/50 bg-background/50 p-3.5"
                    >
                      <h3 className="font-semibold text-[13px]">{achievement.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic text-center p-2">
                    Achievements will unlock over time.
                  </p>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Preference({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-5 shadow-sm transition hover:shadow-md hover:bg-muted/10">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function ProfileLink({
  href,
  label,
  icon,
}: {
  href?: string;
  label: string;
  icon?: "linkedin" | "github";
}) {
  const safeHref = href && /^https?:\/\//i.test(href) ? href : undefined;
  if (!safeHref) return null;
  const Icon = icon === "linkedin" ? Linkedin : icon === "github" ? Github : BriefcaseBusiness;

  return (
    <Button asChild variant="outline" className="h-10 justify-start rounded-lg transition-colors hover:bg-muted">
      <a href={safeHref} target="_blank" rel="noreferrer">
        <Icon className="mr-2 h-4 w-4" />
        {label}
        <ExternalLink className="ml-auto h-3.5 w-3.5 opacity-50" />
      </a>
    </Button>
  );
}
