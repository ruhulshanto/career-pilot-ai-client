"use client";

import { SidebarItem } from "./sidebar-item";
import type { NavGroup } from "@/shared/lib/navigation-config";

interface SidebarGroupProps {
  group: NavGroup;
  isCollapsed: boolean;
  workspaceBase: string;
  onItemClick?: () => void;
}

export function SidebarGroup({ group, isCollapsed, workspaceBase, onItemClick }: SidebarGroupProps) {
  return (
    <div className="py-2">
      {!isCollapsed && (
        <h4 className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          {group.label}
        </h4>
      )}
      <div className="space-y-0.5">
        {group.items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isCollapsed={isCollapsed}
            workspaceBase={workspaceBase}
            onClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
}
