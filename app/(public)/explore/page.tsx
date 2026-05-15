import { PublicInfoPage } from "../components/public-info-page";

export default function ExplorePage() {
  return (
    <PublicInfoPage
      eyebrow="Explore tools"
      title="Career tools that work together instead of living in separate tabs."
      description="Upload a resume, generate a roadmap, practice interviews, track jobs, and ask the AI assistant for guidance from the same workspace."
      items={[
        "Resume Intelligence: upload PDF, DOCX, or TXT resumes and receive structured AI feedback.",
        "Career Roadmap: convert goals and gaps into milestones, projects, and skills.",
        "Interview Practice: generate role-based questions and track feedback over time.",
        "Job Assistant: save roles, compare job descriptions, and manage the application pipeline.",
      ]}
      ctaHref="/dashboard/user"
      ctaLabel="Open workspace"
    />
  );
}
