import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { AdminUsersManager } from "@/features/admin/components/admin-users-manager";

export default function AdminUsersPage() {
  return (
    <DashboardShell
      title="User Management"
      description="View, filter, and audit all users across the platform."
    >
      <AdminUsersManager />
    </DashboardShell>
  );
}
