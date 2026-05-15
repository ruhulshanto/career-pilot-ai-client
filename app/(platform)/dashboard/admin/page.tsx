import { DashboardShell } from '@/shared/components/layout/dashboard-shell';
import { AdminDashboard } from '@/features/admin/components/admin-dashboard';

export default function AdminDashboardPage() {
  return (
    <DashboardShell
      title="Admin Dashboard"
      description="Platform analytics, AI usage, operational health, and recent activity."
    >
      <AdminDashboard />
    </DashboardShell>
  );
}




