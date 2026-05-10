import { DashboardShell } from '@/shared/components/layout/dashboard-shell';
import { AnalyticsCards } from '@/features/analytics/components/analytics-cards';

export default function MentorDashboardPage() {
  return (
    <DashboardShell title="Mentor Dashboard">
      <AnalyticsCards />
    </DashboardShell>
  );
}




