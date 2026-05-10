"use client";

import { Search, Bell, Menu, User } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export function Topbar({
  onMobileMenuToggle,
}: {
  onMobileMenuToggle: () => void;
}) {
  return (
    <header className="z-30 flex h-16 shrink-0 items-center justify-between border-b border-border/70 bg-card/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className="md:hidden text-muted-foreground hover:text-foreground hover:bg-white/5"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="relative hidden max-w-xl flex-1 sm:block">
          <Input
            placeholder="Ask CareerAI: resume score, skill gaps, mock interview..."
            className="h-11 rounded-2xl border border-cyan-300/15 bg-[#07111F] pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-cyan-300/40 focus:ring-cyan-300/10"
          />
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Online
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground hover:bg-white/5"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground hover:bg-white/5"
          aria-label="Open account menu"
        >
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
