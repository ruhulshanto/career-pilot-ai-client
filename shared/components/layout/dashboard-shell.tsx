"use client";

import { useState, type PropsWithChildren, type ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { motion } from "framer-motion";

const DESKTOP_SIDEBAR_WIDTH = 280;
const DESKTOP_SIDEBAR_COLLAPSED_WIDTH = 80;
interface DashboardShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function DashboardShell({
  title,
  description,
  actions,
  children,
}: PropsWithChildren<DashboardShellProps>) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const sidebarWidth = isCollapsed
    ? DESKTOP_SIDEBAR_COLLAPSED_WIDTH
    : DESKTOP_SIDEBAR_WIDTH;

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#060B18]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(79,70,229,0.18),transparent_30%),linear-gradient(135deg,rgba(6,182,212,0.08),transparent_35%,rgba(124,58,237,0.08))]" />
      <Sidebar
        isCollapsed={isCollapsed}
        desktopWidth={sidebarWidth}
        onCollapseToggle={() => setIsCollapsed((value) => !value)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar
          onMobileMenuToggle={() => setIsMobileSidebarOpen((value) => !value)}
        />

        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <div className="mb-10">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                  <div className="space-y-3">
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                      {title}
                    </h1>
                    {description && (
                      <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                        {description}
                      </p>
                    )}
                  </div>
                  {actions ? (
                    <div className="flex flex-wrap gap-3">{actions}</div>
                  ) : null}
                </div>
              </div>

              <div>{children}</div>
            </motion.div>

            <footer className="mt-10 border-t border-border px-4 py-6 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
              © 2024 CareerAI. All rights reserved.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
