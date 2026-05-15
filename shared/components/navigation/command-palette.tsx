"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Command } from "cmdk";
import { Search, Bot, FileText, Map, Briefcase, Settings, X, ChevronRight } from "lucide-react";

import { useUiStore } from "@/shared/store/ui-store";
import { useAuthStore } from "@/shared/store/auth-store";
import { getWorkspaceBaseFromPath } from "@/shared/lib/role-routing";

export default function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const role = useAuthStore((s) => s.role);
  
  const isOpen = useUiStore((s) => s.isCommandPaletteOpen);
  const setOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const toggleAiDrawer = useUiStore((s) => s.toggleAiDrawer);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const workspaceBase = getWorkspaceBaseFromPath(pathname || "/", role);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!mounted) return null;

  return (
    <Command.Dialog 
      open={isOpen} 
      onOpenChange={setOpen} 
      label="Global Command Palette"
      className="fixed left-1/2 top-1/2 z-[100] w-[90vw] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-border/60 bg-popover/95 backdrop-blur-2xl shadow-2xl shadow-elevation/20 animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="flex items-center border-b border-border/40 px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground/70" />
        <Command.Input 
          autoFocus 
          placeholder="Search or ask AI... (Type a command)" 
          className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button 
          onClick={() => setOpen(false)} 
          className="ml-2 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Close</span>
        </button>
      </div>
      <Command.List className="max-h-[60vh] overflow-y-auto overflow-x-hidden p-2 custom-scrollbar">
        <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
          No results found.
        </Command.Empty>
        
        <Command.Group heading="AI Actions" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 px-2 py-2">
          <Command.Item 
            onSelect={() => runCommand(() => toggleAiDrawer())}
            className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-all hover:bg-primary/10 hover:text-primary data-[selected='true']:bg-primary/10 data-[selected='true']:text-primary"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <span className="font-medium">Ask AI Copilot...</span>
            <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 group-data-[selected='true']:opacity-100 transition-opacity" />
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Navigation" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 px-2 py-2 mt-1 border-t border-border/30">
          <Command.Item 
            onSelect={() => runCommand(() => router.push(workspaceBase))}
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-all hover:bg-muted data-[selected='true']:bg-muted"
          >
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Go to Dashboard</span>
          </Command.Item>
          <Command.Item 
            onSelect={() => runCommand(() => router.push(`${workspaceBase}/resume`))}
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-all hover:bg-muted data-[selected='true']:bg-muted mt-0.5"
          >
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Open Resume Lab</span>
          </Command.Item>
          <Command.Item 
            onSelect={() => runCommand(() => router.push(`${workspaceBase}/roadmap`))}
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-all hover:bg-muted data-[selected='true']:bg-muted mt-0.5"
          >
            <Map className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">View Career Roadmap</span>
          </Command.Item>
          <Command.Item 
            onSelect={() => runCommand(() => router.push(`${workspaceBase}/settings`))}
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-all hover:bg-muted data-[selected='true']:bg-muted mt-0.5"
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">System Settings</span>
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
