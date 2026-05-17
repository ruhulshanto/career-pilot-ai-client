"use client";

import { LayoutGrid } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/store/auth-store";
import { getRoleWorkspaceLabel } from "@/shared/lib/role-routing";

export function WorkspaceSwitcher({ isCollapsed }: { isCollapsed: boolean }) {
  const { user, role } = useAuthStore();
  const workspaceLabel = getRoleWorkspaceLabel(role);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg p-2 transition-colors duration-200",
        isCollapsed ? "justify-center" : "hover:bg-muted/40 cursor-pointer",
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 shadow-sm">
        <LayoutGrid className="h-5 w-5 text-primary" />
      </div>
      {!isCollapsed && (
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest">
            {workspaceLabel}
          </p>
        </div>
      )}
    </div>
  );
}
