"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bot, Send } from "lucide-react";
import { CareerPilotTrajectoryIcon } from "@/shared/components/icons/CareerPilotTrajectoryIcon";

import { useUiStore } from "@/shared/store/ui-store";
import { useAiContextStore } from "@/shared/store/ai-context-store";

export default function AiDrawer() {
  const isOpen = useUiStore((s) => s.isAiDrawerOpen);
  const setOpen = useUiStore((s) => s.setAiDrawerOpen);
  const context = useAiContextStore((s) => s.context);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Handle scroll locking when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="relative flex h-full w-full flex-col border-l border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl shadow-elevation/20 sm:w-[420px] lg:w-[480px] dark-surface-sidebar"
            role="dialog"
            aria-label="AI Copilot Drawer"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border/40 px-5 py-4 bg-card/50">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary shadow-sm shadow-primary/10">
                  <CareerPilotTrajectoryIcon className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground leading-tight">Career Copilot</h2>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Always Ready</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                aria-label="Close AI Drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 py-6 custom-scrollbar flex flex-col justify-end min-h-0 bg-background/30">
              
              {/* Context Indicator (Minimalist injection proof) */}
              <div className="mb-auto self-start rounded-xl border border-border/40 bg-muted/30 px-3 py-2 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <CareerPilotTrajectoryIcon className="h-3.5 w-3.5 text-primary/80" />
                  <span>
                    Context: <strong className="text-foreground/80">{context.pageMetadata.title || "Dashboard"}</strong>
                  </span>
                </div>
              </div>

              {/* Empty State / Placeholder Messages */}
              <div className="space-y-4 mb-2 mt-8">
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                    <CareerPilotTrajectoryIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-muted/40 px-4 py-3 text-sm text-foreground shadow-sm border border-border/30 max-w-[85%] leading-relaxed">
                    <p>Hi! I'm your Career Copilot. I can see you are looking at the <strong>{context.pageMetadata.title || "Dashboard"}</strong>.</p>
                    <p className="mt-2 text-muted-foreground">This is a structural placeholder for Phase 4. Context injection is active.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Input Area */}
            <div className="shrink-0 border-t border-border/40 p-4 bg-card/80 backdrop-blur-md">
              <div className="relative flex items-end">
                <textarea 
                  rows={1}
                  className="w-full resize-none rounded-xl border border-border/60 bg-background/50 py-3 pl-4 pr-12 text-sm placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 custom-scrollbar max-h-32 min-h-[44px] transition-colors"
                  placeholder="Ask anything..."
                  aria-label="Ask AI Copilot"
                />
                <button 
                  className="absolute bottom-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 shadow-sm shadow-primary/20"
                  aria-label="Send message"
                >
                  <Send className="h-3.5 w-3.5 ml-0.5" />
                </button>
              </div>
              <p className="mt-2.5 text-center text-[10px] font-medium text-muted-foreground/50">
                Copilot can make mistakes. Verify important information.
              </p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
