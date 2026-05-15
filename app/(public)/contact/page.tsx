import { PublicInfoPage } from "../components/public-info-page";

export default function ContactPage() {
  return (
    <PublicInfoPage
      eyebrow="Contact"
      title="Review Career Pilot AI from the inside."
      description="Create a workspace to evaluate the core product flows: resume upload, roadmap generation, interview practice, job tracking, and AI guidance."
      items={[
        "Use demo login locally when seeded accounts are enabled for reviewer walkthroughs.",
        "Validate backend health, SMTP, Redis, database, and AI credentials before deployment demos.",
        "Use the public assistant for a quick first impression, then open the dashboard for persistent workflows.",
        "Connect a real support inbox before public production launch.",
      ]}
      ctaHref="/login"
      ctaLabel="Go to login"
    />
  );
}
