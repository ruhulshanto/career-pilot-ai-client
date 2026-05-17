import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { PlatformAnalyticsDashboard } from "@/features/admin/components/platform-analytics-dashboard";

export default function AdminAnalyticsPage() {
  return (
    <DashboardShell
      title="Platform Analytics"
      description="Deep dive into platform telemetry, LLM token consumption, and distributed queue health."
    >
      <PlatformAnalyticsDashboard />
    </DashboardShell>
  );
}
