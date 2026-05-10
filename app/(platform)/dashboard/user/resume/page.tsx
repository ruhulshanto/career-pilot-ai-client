import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { ResumeUploadPanel } from "@/features/resume/components/resume-upload-panel";

export default function ResumePage() {
  return (
    <DashboardShell
      title="Resume Analysis"
      description="Upload your resume to surface tailored insights, ATS fit, and suggestions for higher interview conversion."
    >
      <div className="grid gap-8">
        <ResumeUploadPanel />
      </div>
    </DashboardShell>
  );
}
