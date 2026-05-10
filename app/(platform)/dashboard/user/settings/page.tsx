"use client";

import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { ProfileForm } from "@/features/settings/components/profile-form";
import { SettingsSidebar } from "@/features/settings/components/settings-sidebar";

export default function SettingsPage() {
  return (
    <DashboardShell
      title="Settings"
      description="Manage your profile details, notification preferences, and account settings in one place."
    >
      <div className="grid gap-10 lg:grid-cols-4">
        <SettingsSidebar />
        <div className="lg:col-span-3 space-y-8">
          <ProfileForm />
        </div>
      </div>
    </DashboardShell>
  );
}
