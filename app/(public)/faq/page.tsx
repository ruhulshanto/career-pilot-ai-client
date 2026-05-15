import { PublicInfoPage } from "../components/public-info-page";

export default function FaqPage() {
  return (
    <PublicInfoPage
      eyebrow="FAQ"
      title="Built for a realistic portfolio-ready SaaS demo."
      description="The product is designed to show secure full-stack engineering, AI workflow design, and believable career-product value."
      items={[
        "Does it scrape LinkedIn? No. It creates safe search-assistant links and user-managed tracking.",
        "Are resumes public? No. Resume files are stored in a private upload path and processed server-side.",
        "Does email really send? Yes. The backend uses Gmail SMTP through a provider abstraction.",
        "Can users switch accounts safely? Yes. Auth state and query caches reset across account transitions.",
      ]}
    />
  );
}
