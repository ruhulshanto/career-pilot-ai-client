import { PublicInfoPage } from "../components/public-info-page";

export default function TermsPage() {
  return (
    <PublicInfoPage
      eyebrow="Terms"
      title="Use Career Pilot AI as a career support tool."
      description="Career Pilot AI provides AI-assisted guidance for resumes, roadmaps, interviews, and job tracking. Users remain responsible for final career decisions and submitted application materials."
      items={[
        "AI recommendations are guidance, not employment, legal, financial, or hiring guarantees.",
        "Users should review AI-generated resume, interview, and job-search outputs before relying on them.",
        "Job search features are designed as honest assistant workflows, not scraping or unofficial platform access.",
        "Production use should follow the configured security, privacy, and acceptable-use policies of the deployment.",
      ]}
      ctaHref="/register"
      ctaLabel="Start free"
    />
  );
}
