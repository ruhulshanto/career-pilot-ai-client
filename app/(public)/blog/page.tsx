import { PublicInfoPage } from "../components/public-info-page";

export default function BlogPage() {
  return (
    <PublicInfoPage
      eyebrow="Career insights"
      title="Practical notes on AI-assisted career growth."
      description="The blog surface is reserved for focused guides on resumes, roadmaps, interviews, job search, and building a more measurable career plan."
      items={[
        "How to turn a generic resume into role-specific proof.",
        "How to build a roadmap from job descriptions without chasing every skill.",
        "How to practice interviews with feedback loops instead of one-off questions.",
        "How to track applications without pretending every job board has an open API.",
      ]}
      ctaHref="/explore"
      ctaLabel="Explore tools"
    />
  );
}
