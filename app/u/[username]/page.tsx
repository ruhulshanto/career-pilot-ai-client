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
  Loader2,
  MapPin,
  Mail,
  Target,
  Star,
  User,
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

export default function PublicCareerProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const portfolioQuery = useQuery({
    queryKey: ["public-profile", username],
    queryFn: () => profileApi.getPublicPortfolio(username),
    retry: 1,
  });

  if (portfolioQuery.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!portfolioQuery.data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6 text-center text-foreground">
        <div>
          <h1 className="text-3xl font-semibold">Profile unavailable</h1>
          <p className="mt-3 text-muted-foreground">
            This career portfolio is private or does not exist.
          </p>
          <Button asChild className="mt-6 rounded-lg">
            <Link href="/">Back to CareerAI</Link>
          </Button>
        </div>
      </main>
    );
  }

  return <PortfolioView portfolio={portfolioQuery.data} />;
}

function PortfolioView({ portfolio }: { portfolio: CareerPortfolio }) {
  const name = `${portfolio.user.firstName} ${portfolio.user.lastName}`;
  const links = portfolio.user.socialLinks ?? {};
  const isMentorProfile =
    portfolio.user.role === "MENTOR" || portfolio.user.role === "COACH";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/70 bg-card/70">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/30">
              {portfolio.user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={portfolio.user.avatarUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-primary">
                @{portfolio.user.username}
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                {name}
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
                {portfolio.user.headline ||
                  (isMentorProfile
                    ? "Mentoring professionals through practical career growth."
                    : `Building toward ${portfolio.user.targetRole ?? "a stronger career path"}`)}
              </p>
              {isMentorProfile ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {(portfolio.user.mentorSpecialties ?? [
                    "Roadmap reviews",
                    "Interview readiness",
                    "Resume strategy",
                  ]).map((specialty) => (
                    <span
                      key={specialty}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                {portfolio.user.currentPosition && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                    <BriefcaseBusiness className="h-4 w-4 text-accent" />
                    {portfolio.user.currentPosition}
                    {portfolio.user.currentCompany
                      ? ` at ${portfolio.user.currentCompany}`
                      : ""}
                  </span>
                )}
                {portfolio.user.targetRole && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                    <Target className="h-4 w-4 text-accent" />
                    {portfolio.user.targetRole}
                  </span>
                )}
                {portfolio.user.location && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                    <MapPin className="h-4 w-4 text-accent" />
                    {portfolio.user.location}
                  </span>
                )}
                {portfolio.user.email && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
                    <Mail className="h-4 w-4 text-accent" />
                    {portfolio.user.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Card className="border border-border bg-background/60 shadow-sm">
            <CardContent className="grid grid-cols-2 gap-3 p-5">
              {isMentorProfile ? (
                <>
                  <Stat
                    label="Rating"
                    value={
                      typeof portfolio.user.mentorRating === "number"
                        ? portfolio.user.mentorRating.toFixed(1)
                        : "New"
                    }
                  />
                  <Stat
                    label="Reviews"
                    value={portfolio.user.mentorCompletedReviews ?? 0}
                  />
                  <Stat label="Specialties" value={portfolio.user.mentorSpecialties?.length ?? 0} />
                  <Stat label="Expertise" value={portfolio.user.mentorExpertise?.length ?? 0} />
                </>
              ) : (
                <>
                  <Stat label="ATS Score" value={portfolio.stats.atsScore} />
                  <Stat label="Readiness" value={portfolio.stats.interviewReadiness} />
                  <Stat label="Roadmap" value={portfolio.stats.roadmapProgress} />
                  <Stat label="Applications" value={portfolio.stats.applicationsSent} />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-8">
            <Card className="border border-border shadow-sm">
              <CardHeader>
                <CardTitle>{isMentorProfile ? "Mentor Bio" : "Career Story"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-muted-foreground">
                  {portfolio.user.experienceSummary ||
                    portfolio.user.bio ||
                    "This portfolio updates from CareerAI progress: resume analysis, roadmap milestones, interview mentoring, goals, and job activity."}
                </p>
                {portfolio.user.bio && portfolio.user.experienceSummary ? (
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {portfolio.user.bio}
                  </p>
                ) : null}
              </CardContent>
            </Card>

            {isMentorProfile ? (
              <Card className="border border-border shadow-sm">
                <CardHeader>
                  <CardTitle>Mentor Expertise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-accent" />
                    {typeof portfolio.user.mentorRating === "number"
                      ? `${portfolio.user.mentorRating.toFixed(1)} mentor rating`
                      : "New mentor profile"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(portfolio.user.mentorExpertise ?? [
                      "Career transitions",
                      "Technical interview prep",
                      "Portfolio positioning",
                    ]).map((expertise) => (
                      <span
                        key={expertise}
                        className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                      >
                        {expertise}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <Card className="border border-border shadow-sm">
              <CardHeader>
                <CardTitle>Roadmap Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="h-3 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${portfolio.stats.roadmapProgress}%` }}
                  />
                </div>
                {portfolio.roadmap?.completedMilestones.length ? (
                  <div className="grid gap-3">
                    {portfolio.roadmap.completedMilestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="rounded-lg border border-border/70 p-4"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-accent" />
                          <h3 className="font-semibold">{milestone.title}</h3>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {milestone.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Completed milestones will appear as roadmap work progresses.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm">
              <CardHeader>
                <CardTitle>Skills And Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {portfolio.skills.slice(0, 12).map((skill) => (
                    <span
                      key={skill.name}
                      className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {portfolio.projects.slice(0, 4).map((project) => (
                    <div
                      key={project.title}
                      className="rounded-lg border border-border/70 p-4"
                    >
                      <h3 className="font-semibold">{project.title}</h3>
                      {project.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {project.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm">
              <CardHeader>
                <CardTitle>Education And Certifications</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Education
                  </h3>
                  {portfolio.user.education?.length ? (
                    portfolio.user.education.map((item, index) => (
                      <div key={index} className="rounded-lg border border-border/70 p-4">
                        <p className="font-semibold text-foreground">
                          {String(item.degree ?? item.school ?? "Education")}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {[item.school, item.year].filter(Boolean).join(" - ")}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Education details are not listed yet.
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Certifications
                  </h3>
                  {portfolio.certifications.length ? (
                    portfolio.certifications.slice(0, 6).map((certification) => (
                      <div key={certification.title} className="rounded-lg border border-border/70 p-4">
                        <p className="font-semibold text-foreground">
                          {certification.title}
                        </p>
                        {"issuer" in certification && certification.issuer ? (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {String(certification.issuer)}
                          </p>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Certifications will appear here when added.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-8">
            <Card className="border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {portfolio.achievements.length ? (
                  portfolio.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="rounded-lg border border-border/70 p-4"
                    >
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Achievements unlock as this user completes career actions.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm">
              <CardHeader>
                <CardTitle>Career Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {portfolio.careerGoals.map((goal) => (
                  <div key={goal.id} className="rounded-lg bg-muted/35 p-4">
                    <h3 className="font-semibold">{goal.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {goal.progress}% complete - {goal.status.toLowerCase()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {portfolio.user.yearsExperience !== null &&
                portfolio.user.yearsExperience !== undefined ? (
                  <Preference label="Experience" value={`${portfolio.user.yearsExperience} years`} />
                ) : null}
                <Preference label="Job type" value={portfolio.user.preferredJobType} />
                <Preference
                  label="Work mode"
                  value={formatPreferredWorkMode(portfolio.user.preferredWorkMode)}
                />
                <Preference label="Salary" value={portfolio.user.preferredSalaryRange} />
                {portfolio.user.languages?.length ? (
                  <div>
                    <p className="font-semibold text-foreground">Languages</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {portfolio.user.languages.map((language) => (
                        <span key={language} className="rounded-full bg-muted/40 px-3 py-1 text-xs">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm">
              <CardHeader>
                <CardTitle>Links</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <ProfileLink href={links.linkedin} label="LinkedIn" icon="linkedin" />
                <ProfileLink href={links.github} label="GitHub" icon="github" />
                <ProfileLink href={links.portfolio || links.website} label="Portfolio" />
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
    <div>
      <p className="font-semibold text-foreground">{label}</p>
      <p>{value}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-border/70 bg-muted/25 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
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
    <Button asChild variant="outline" className="h-10 justify-start rounded-lg">
      <a href={safeHref} target="_blank" rel="noreferrer">
        <Icon className="mr-2 h-4 w-4" />
        {label}
        <ExternalLink className="ml-auto h-4 w-4" />
      </a>
    </Button>
  );
}
