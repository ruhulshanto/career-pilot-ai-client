import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { SystemHealthDashboard } from "@/features/admin/components/system-health-dashboard";

export default function AdminSystemHealthPage() {
  return (
    <DashboardShell
      title="System Health & Infrastructure"
      description="Real-time monitoring of server health, database diagnostics, distributed Redis caching, BullMQ job queues, and AI/Email provider configurations."
    >
      <SystemHealthDashboard />
    </DashboardShell>
  );
}
