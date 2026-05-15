import { PublicInfoPage } from "../components/public-info-page";

export default function PrivacyPage() {
  return (
    <PublicInfoPage
      eyebrow="Privacy"
      title="Privacy-minded career workflows by default."
      description="Career Pilot AI is designed around private uploads, authenticated workspaces, and clear user-controlled career data."
      items={[
        "Resume files should be uploaded only through the secure upload flow and are not intended for public exposure.",
        "Authenticated dashboard data is scoped to the signed-in user and protected by the application session model.",
        "The public homepage assistant is temporary and does not create saved chat sessions.",
        "Production deployments should configure private storage, secure environment variables, and provider-level data controls.",
      ]}
      ctaHref="/contact"
      ctaLabel="Contact us"
    />
  );
}
