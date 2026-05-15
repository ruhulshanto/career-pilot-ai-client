"use client";

import { Search } from "lucide-react";
import { useUiStore } from "@/shared/store/ui-store";

export function CommandTrigger() {
  const toggleCommandPalette = useUiStore((s) => s.toggleCommandPalette);

  return (
    <button
      onClick={toggleCommandPalette}
      className="group relative hidden min-w-0 flex-1 max-w-sm rounded-lg border border-border/50 bg-background/40 px-3 py-1.5 text-sm text-muted-foreground transition-all hover:border-primary/40 hover:bg-muted/40 hover:text-foreground md:flex items-center gap-2"
    >
      <Search className="h-[14px] w-[14px] text-muted-foreground/70 group-hover:text-primary/70 transition-colors" />
      <span className="truncate flex-1 text-left">Search or ask AI...</span>
      <kbd className="hidden lg:inline-flex h-[22px] items-center gap-1 rounded-md border border-border/60 bg-muted/60 px-1.5 font-mono text-[10px] font-semibold text-muted-foreground opacity-100">
        <span className="text-[10px]">⌘</span>K
      </kbd>
    </button>
  );
}
