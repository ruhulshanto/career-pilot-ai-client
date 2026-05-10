import { DashboardShell } from '@/shared/components/layout/dashboard-shell';
import { AnalyticsCards } from '@/features/analytics/components/analytics-cards';

export default function AdminDashboardPage() {
  return (
    <DashboardShell title="Admin Dashboard">
      <AnalyticsCards />
    </DashboardShell>
  );
}




