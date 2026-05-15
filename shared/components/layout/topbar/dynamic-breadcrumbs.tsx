"use client";

import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getWorkspaceBaseFromPath } from "@/shared/lib/role-routing";
import { getNavigationForRole } from "@/shared/lib/navigation-config";
import { useAuthStore } from "@/shared/store/auth-store";

export function DynamicBreadcrumbs() {
  const pathname = usePathname();
  const role = useAuthStore((s) => s.role);
  
  if (!pathname || !role) return null;

  const workspaceBase = getWorkspaceBaseFromPath(pathname, role);
  const navGroups = getNavigationForRole(role);
  
  let activeGroupLabel = "Workspace";
  let activeItemLabel = "Dashboard";

  for (const group of navGroups) {
    for (const item of group.items) {
      const href = item.path ? `${workspaceBase}/${item.path}` : workspaceBase;
      if (pathname === href || (item.path !== "" && pathname.startsWith(`${href}/`))) {
        activeGroupLabel = group.label;
        activeItemLabel = item.label;
      }
    }
  }

  return (
    <div className="hidden sm:flex items-center text-sm text-muted-foreground/70 gap-2 select-none">
      <span className="font-medium hover:text-foreground transition-colors cursor-pointer">
        {activeGroupLabel}
      </span>
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
      <span className="font-semibold text-foreground">
        {activeItemLabel}
      </span>
    </div>
  );
}
