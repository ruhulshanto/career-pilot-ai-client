import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { MentorReviews } from "@/features/mentor/components/mentor-reviews";

export default function MentorReviewsPage() {
  return (
    <DashboardShell
      title="Review Queue"
      description="View past reviews and manage incoming feedback requests from your students."
    >
      <MentorReviews />
    </DashboardShell>
  );
}
