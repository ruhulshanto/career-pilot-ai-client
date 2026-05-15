import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { MentorDashboard } from "@/features/mentor/components/mentor-dashboard";

export default function AdminMentorPage() {
  return (
    <DashboardShell
      title="Mentor Operations"
      description="Monitor mentor review queues, session requests, and human feedback activity."
    >
      <MentorDashboard />
    </DashboardShell>
  );
}
