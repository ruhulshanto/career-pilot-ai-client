import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { MentorUserCenter } from "@/features/mentor/components/mentor-user-center";

export default function UserMentorPage() {
  return (
    <DashboardShell
      title="Mentor Center"
      description="Request human mentor feedback, view your assigned mentor, and track review conversations."
    >
      <MentorUserCenter />
    </DashboardShell>
  );
}
