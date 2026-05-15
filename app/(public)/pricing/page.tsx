import { PublicInfoPage } from "../components/public-info-page";

export default function PricingPage() {
  return (
    <PublicInfoPage
      eyebrow="Pricing"
      title="Free during the portfolio and judging phase."
      description="Billing UI is intentionally disabled until usage limits, subscriptions, and payment operations are production-ready."
      items={[
        "Free workspace access for resume analysis, roadmaps, interviews, job tracking, and chatbot guidance.",
        "Usage analytics are structured so future billing can be added with real quotas and plan limits.",
        "Premium plan surfaces are marked as inactive rather than pretending payment is live.",
        "A real SaaS launch should add Stripe, invoices, quotas, and billing webhooks.",
      ]}
    />
  );
}
