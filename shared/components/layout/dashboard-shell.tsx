"use client";

import { useEffect, type PropsWithChildren, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

import { careerApi } from "@/services/api/career";
import { CareerJourneyHeader } from "@/features/career/components/career-journey-header";
import { useUiStore } from "@/shared/store/ui-store";
import { useAiContextStore } from "@/shared/store/ai-context-store";
import { useKeyboardShortcuts } from "@/shared/hooks/use-keyboard-shortcuts";

// Dynamic imports for heavy UI overlays
// ssr: false prevents hydration mismatches and saves initial bundle size
const CommandPalette = dynamic(() => import("../navigation/command-palette"), { ssr: false });
const AiDrawer = dynamic(() => import("../navigation/ai-drawer"), { ssr: false });

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
  const pathname = usePathname();
  
  const { closeAllDrawers } = useUiStore();
  const updateAiContext = useAiContextStore((s) => s.updateContext);

  // Initialize global keyboard shortcuts (Cmd+K, Cmd+J, Esc)
  useKeyboardShortcuts();

  // Close overlays on route change and update AI context
  useEffect(() => {
    closeAllDrawers();
    updateAiContext({
      routePath: pathname || "/",
      pageMetadata: { title, description }
    });
  }, [pathname, title, description, closeAllDrawers, updateAiContext]);

  const careerContextQuery = useQuery({
    queryKey: ["career-context"],
    queryFn: careerApi.getContext,
    staleTime: 30_000,
    retry: 1,
  });

  return (
    <div className="dark-workspace-bg fixed inset-0 flex overflow-hidden bg-background selection:bg-primary/30">
      <Sidebar />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar title={title} />

        <main className="dark-content-layer min-h-0 flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8 mb-16 md:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="mb-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="space-y-1.5">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {title}
                    </h1>
                    {description && (
                      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                        {description}
                      </p>
                    )}
                  </div>
                  {actions && (
                    <div className="flex flex-wrap items-center gap-3">
                      {actions}
                    </div>
                  )}
                </div>
              </div>

              <CareerJourneyHeader context={careerContextQuery.data} />

              <div className="relative z-10">{children}</div>
            </motion.div>

            <footer className="mt-12 border-t border-border/40 px-4 py-6 text-center text-sm text-muted-foreground/60 sm:px-6 lg:px-8">
              &copy; {new Date().getFullYear()} Career Pilot AI.
            </footer>
          </div>
        </main>
      </div>

      {/* Global Overlays - Dynamically Imported */}
      <CommandPalette />
      <AiDrawer />
    </div>
  );
}
