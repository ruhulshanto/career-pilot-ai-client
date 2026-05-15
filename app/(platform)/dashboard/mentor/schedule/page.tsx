import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { MentorSchedule } from "@/features/mentor/components/mentor-schedule";

export default function MentorSchedulePage() {
  return (
    <DashboardShell
      title="Mentor Schedule"
      description="Manage your upcoming 1-on-1 sessions, mock interviews, and availability."
    >
      <MentorSchedule />
    </DashboardShell>
  );
}
