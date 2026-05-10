"use client";

import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { NotificationList } from "@/features/notifications/components/notification-list";

export default function NotificationsPage() {
  return (
    <DashboardShell
      title="Notifications"
      description="Stay on top of system updates, signals, and alerts that impact your career plan."
    >
      <NotificationList />
    </DashboardShell>
  );
}
