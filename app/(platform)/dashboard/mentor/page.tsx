import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { MentorDashboard } from "@/features/mentor/components/mentor-dashboard";

export default function MentorDashboardPage() {
  return (
    <DashboardShell
      title="Mentor Dashboard"
      description="Review assigned users, respond to feedback requests, manage sessions, and track mentor activity."
    >
      <MentorDashboard />
    </DashboardShell>
  );
}
