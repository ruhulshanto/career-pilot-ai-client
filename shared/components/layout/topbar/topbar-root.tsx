"use client";

import { Menu, Bot } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { useUiStore } from "@/shared/store/ui-store";
import { useAuthStore } from "@/shared/store/auth-store";
import { getPublicImageUrl } from "@/shared/utils/image";

import { CommandTrigger } from "./command-trigger";
import { DynamicBreadcrumbs } from "./dynamic-breadcrumbs";

interface TopbarProps {
  title?: string;
  onMobileMenuToggle?: () => void;
}

export function TopbarRoot({ title }: TopbarProps) {
  const { toggleMobileDrawer, toggleAiDrawer } = useUiStore();
  const { user } = useAuthStore();

  return (
    <header className="dark-surface-topbar z-30 shrink-0 border-b border-border/40 bg-card/80 px-4 py-2.5 shadow-sm backdrop-blur-xl dark:border-border/40">
      <div className="flex min-w-0 items-center justify-between gap-4 h-9">

        {/* Left: Mobile Trigger & Breadcrumbs */}
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileDrawer}
            className="h-8 w-8 shrink-0 text-foreground md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-4 w-4" />
          </Button>

          <DynamicBreadcrumbs />

          {/* Fallback title for mobile if breadcrumbs are hidden */}
          <span className="sm:hidden text-sm font-semibold truncate text-foreground">
            {title || "Dashboard"}
          </span>
        </div>

        {/* Center: Command Palette Trigger */}
        <div className="flex-1 max-w-xl flex justify-center">
          <CommandTrigger />
        </div>

        {/* Right: Actions */}
        <div className="flex shrink-0 items-center gap-2">
          {/* AI Copilot Button (Prepares for drawer implementation) */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAiDrawer}
            className="hidden sm:flex h-8 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary transition-all gap-1.5"
          >
            <Bot className="h-3.5 w-3.5" />
            <span className="font-medium text-xs">Copilot</span>
            <kbd className="hidden lg:inline-flex ml-1 h-4 items-center gap-1 rounded bg-primary/10 px-1 font-mono text-[9px] font-bold text-primary">
              ⌘J
            </kbd>
          </Button>

          <div className="h-4 w-px bg-border/50 mx-2 hidden sm:block" />

          {/* Notifications Placeholder/Implementation */}
          <div className="relative">
            <NotificationBell />
          </div>
        </div>
      </div>
    </header>
  );
}
