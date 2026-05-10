"use client";

import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { RoadmapViewer } from "@/features/roadmap/components/roadmap-viewer";

export default function RoadmapPage() {
  return (
    <DashboardShell
      title="Career Roadmap"
      description="Follow the next milestones in your professional path with clear status and priority recommendations."
    >
      <div className="grid gap-8">
        <RoadmapViewer />
      </div>
    </DashboardShell>
  );
}
