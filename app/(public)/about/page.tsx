import { PublicInfoPage } from "../components/public-info-page";

export default function AboutPage() {
  return (
    <PublicInfoPage
      eyebrow="About Career Pilot AI"
      title="A practical AI workspace for career momentum."
      description="Career Pilot AI helps users turn resumes, goals, interview practice, and job tracking into one connected career plan."
      items={[
        "Resume analysis and ATS feedback stay connected to roadmap and job workflows.",
        "The job system uses honest search-assistant links and application tracking instead of unsafe scraping.",
        "Dashboards focus on real user activity, progress, and next best actions.",
        "Security-sensitive flows use private uploads, httpOnly refresh cookies, and production SMTP.",
      ]}
    />
  );
}
