"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Map,
  MessageSquare,
  Briefcase,
  Settings,
  Bell,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCircle,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "AI Dashboard", href: "/dashboard/user" },
  {
    icon: FileText,
    label: "Resume Intelligence",
    href: "/dashboard/user/resume",
  },
  {
    icon: MessageSquare,
    label: "Interview AI",
    href: "/dashboard/user/interview",
  },
  { icon: Map, label: "Career Roadmap", href: "/dashboard/user/roadmap" },
  {
    icon: BarChart3,
    label: "Skill Analytics",
    href: "/dashboard/user#skill-analytics",
  },
  { icon: Briefcase, label: "AI Assistant", href: "/dashboard/user/chat" },
  { icon: Bell, label: "Notifications", href: "/dashboard/user/notifications" },
  { icon: Settings, label: "Settings", href: "/dashboard/user/settings" },
];

interface SidebarProps {
  isCollapsed: boolean;
  desktopWidth: number;
  onCollapseToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({
  isCollapsed,
  desktopWidth,
  onCollapseToggle,
  isMobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();

  const renderContent = (showCollapseControl: boolean) => (
    <div className="relative flex h-full min-h-0 flex-col">
      <div className="flex h-16 shrink-0 items-center border-b border-border/70 px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary shadow-sm shadow-black/20">
            <span className="text-lg font-bold text-primary-foreground">C</span>
          </div>
          {!isCollapsed && (
            <span className="truncate text-lg font-semibold tracking-tight text-foreground">
              CareerAI
            </span>
          )}
        </div>
      </div>

      <nav className="custom-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href} onClick={onMobileClose}>
              <div
                className={cn(
                  "group relative flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors duration-200",
                  isCollapsed ? "justify-center" : "",
                  isActive
                    ? "bg-white/5 text-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill-sidebar"
                    className="absolute left-0 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-r-full bg-primary"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-primary" : "group-hover:text-foreground",
                  )}
                />
                {!isCollapsed && (
                  <span className="truncate text-sm font-medium leading-none">
                    {item.label}
                  </span>
                )}

                {isCollapsed && showCollapseControl && (
                  <div className="absolute left-full top-1/2 z-50 hidden -translate-y-1/2 rounded-2xl border border-white/10 bg-[#0B1120]/95 px-3 py-2 text-xs text-white shadow-lg group-hover:block">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-border/70 p-4">
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl p-3 transition-colors duration-200",
            isCollapsed ? "justify-center" : "hover:bg-white/5",
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
            <UserCircle className="h-6 w-6 text-primary" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                Alex Johnson
              </p>
              <p className="text-xs text-muted-foreground">Premium Plan</p>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          className={cn(
            "mt-4 h-10 w-full justify-start gap-3 rounded-2xl text-muted-foreground hover:bg-white/5 hover:text-foreground",
            isCollapsed ? "justify-center px-0" : "",
          )}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && (
            <span className="text-sm font-medium">Sign out</span>
          )}
        </Button>
      </div>

      {showCollapseControl && (
        <button
          onClick={onCollapseToggle}
          className="absolute -right-3 top-5 z-50 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#0B1120] shadow-lg transition-all hover:bg-white/5"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: desktopWidth }}
        style={{ width: desktopWidth }}
        className="relative z-40 hidden h-full min-h-0 shrink-0 flex-col border-r border-border bg-card md:flex"
      >
        {renderContent(true)}
      </motion.aside>

      <div
        className={cn(
          "fixed inset-0 z-50 transition-all duration-300 md:hidden",
          isMobileOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0",
        )}
      >
        <div
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          onClick={onMobileClose}
        />
        <aside className="relative flex h-dvh w-80 max-w-[85vw] flex-col overflow-hidden border-r border-border bg-card shadow-2xl">
          {renderContent(false)}
        </aside>
      </div>
    </>
  );
}
