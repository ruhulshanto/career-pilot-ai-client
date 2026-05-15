"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import type { NavItem } from "@/shared/lib/navigation-config";

interface SidebarItemProps {
  item: NavItem;
  isCollapsed: boolean;
  workspaceBase: string;
  onClick?: () => void;
}

export function SidebarItem({ item, isCollapsed, workspaceBase, onClick }: SidebarItemProps) {
  const pathname = usePathname();
  const href = item.path ? `${workspaceBase}/${item.path}` : workspaceBase;
  
  // Active route detection exactly matches the path or sub-routes
  const isActive = pathname === href || (item.path !== "" && pathname.startsWith(`${href}/`));

  return (
    <Link href={href} onClick={onClick}>
      <div
        className={cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-200 focus-within:ring-2 focus-within:ring-ring/30",
          isCollapsed ? "justify-center" : "",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
        )}
      >
        {isActive && (
          <motion.div
            layoutId="active-sidebar-indicator"
            className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        
        <item.icon
          className={cn(
            "h-[18px] w-[18px] shrink-0 transition-colors",
            isActive ? "text-primary" : "group-hover:text-foreground",
          )}
        />
        
        {!isCollapsed && (
          <span className="truncate text-sm leading-none flex-1">
            {item.label}
          </span>
        )}
        
        {!isCollapsed && item.badge && (
          <span className="ml-auto flex h-5 items-center justify-center rounded-full bg-primary/20 px-1.5 text-[10px] font-medium text-primary">
            {item.badge}
          </span>
        )}

        {isCollapsed && (
          <div className="absolute left-full top-1/2 z-50 hidden -translate-y-1/2 ml-2 rounded-md border border-border bg-popover px-2 py-1.5 text-xs font-medium text-popover-foreground shadow-lg group-hover:block whitespace-nowrap">
            {item.label}
          </div>
        )}
      </div>
    </Link>
  );
}
