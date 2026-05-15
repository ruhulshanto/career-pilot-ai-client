"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { SettingsSidebar } from "@/features/settings/components/settings-sidebar";

type SettingsSectionShellProps = {
  children: ReactNode;
};

export function SettingsSectionShell({ children }: SettingsSectionShellProps) {
  const pathname = usePathname();

  return (
    <DashboardShell
      title="Settings"
      description="Manage your profile details, notification preferences, security, and account plan."
    >
      <div className="grid gap-6 lg:grid-cols-4 lg:gap-10">
        <SettingsSidebar />
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="space-y-8 lg:col-span-3"
        >
          {children}
        </motion.div>
      </div>
    </DashboardShell>
  );
}
