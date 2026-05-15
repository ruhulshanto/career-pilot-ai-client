import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { MentorStudents } from "@/features/mentor/components/mentor-students";

export default function MentorStudentsPage() {
  return (
    <DashboardShell
      title="My Students"
      description="View and manage the users currently assigned to you for mentorship."
    >
      <MentorStudents />
    </DashboardShell>
  );
}
