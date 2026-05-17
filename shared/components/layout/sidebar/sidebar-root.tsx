"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, LogOut, PanelLeftClose } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { useUiStore } from "@/shared/store/ui-store";
import { useAuthStore } from "@/shared/store/auth-store";
import { authApi } from "@/services/auth/auth-api";
import { getWorkspaceBaseFromPath } from "@/shared/lib/role-routing";
import { getNavigationForRole } from "@/shared/lib/navigation-config";
import { getPublicImageUrl } from "@/shared/utils/image";
import { ProfileImagePreview } from "@/shared/components/ui/profile-image-preview";

import { SidebarGroup } from "./sidebar-group";
import { BrandLogo } from "../brand-logo";

export function SidebarRoot() {
  const pathname = usePathname();
  const router = useRouter();

  const { isSidebarCollapsed, toggleSidebar, isMobileDrawerOpen, setMobileDrawerOpen } = useUiStore();
  const { role, user, logout } = useAuthStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const workspaceBase = getWorkspaceBaseFromPath(pathname, role);
  const navGroups = getNavigationForRole(role);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      logout();
      setMobileDrawerOpen(false);
      router.replace("/login");
    }
  };

  const desktopWidth = isSidebarCollapsed ? 80 : 260;

  const renderContent = (isMobile: boolean) => (
    <div className="relative flex h-full min-h-0 flex-col bg-card/40 backdrop-blur-md">
      {/* Brand Header */}
      <div className={cn(
        "flex h-16 shrink-0 items-center border-b border-border/40",
        (isSidebarCollapsed && !isMobile) ? "justify-center px-2" : "px-4",
      )}>
        <BrandLogo variant="sidebar" collapsed={isSidebarCollapsed && !isMobile} />
      </div>

      {/* Navigation Areas */}
      <nav className="custom-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-4">
        {mounted && navGroups.map((group) => (
          <SidebarGroup
            key={group.id}
            group={group}
            isCollapsed={isSidebarCollapsed && !isMobile}
            workspaceBase={workspaceBase}
            onItemClick={() => setMobileDrawerOpen(false)}
          />
        ))}
      </nav>

      {/* Bottom Footer Area */}
      <div className="shrink-0 border-t border-border/40 p-3 bg-background/20 flex flex-col gap-2">
        {/* User Mini Profile & Sign Out row */}
        <div className={cn(
          "flex items-center gap-2",
          (isSidebarCollapsed && !isMobile) ? "flex-col" : "justify-between"
        )}>
          <Link
            href={workspaceBase + "/settings"}
            onClick={() => setMobileDrawerOpen(false)}
            className={cn(
              "group flex items-center gap-3 rounded-2xl p-2 transition-all hover:bg-accent/5 active:scale-95 min-w-0",
              (isSidebarCollapsed && !isMobile) ? "justify-center w-full" : "flex-1"
            )}
          >
            <ProfileImagePreview avatarUrl={user?.avatarUrl} name={user?.name}>
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border/60 bg-muted shadow-sm ring-2 ring-border/20 transition-all group-hover:ring-accent/30">
                {user?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getPublicImageUrl(user.avatarUrl) ?? ""}
                    alt={user.firstName || "User"}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-accent/10 text-accent text-xs font-bold">
                    {(user?.firstName?.[0] || user?.email?.[0] || "U").toUpperCase()}
                  </div>
                )}
              </div>
            </ProfileImagePreview>
            
            {(!isSidebarCollapsed || isMobile) && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground transition-colors group-hover:text-accent">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-[11px] font-medium text-muted-foreground">
                  @{user?.username || "user"}
                </p>
              </div>
            )}
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0 flex items-center justify-center"
            title="Sign out"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </Button>
        </div>
      </div>

      {/* Desktop Collapse Trigger */}
      {!isMobile && (
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-5 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-all hover:bg-muted/70 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring/40"
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <PanelLeftClose className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: desktopWidth }}
        style={{ width: desktopWidth }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="dark-surface-sidebar relative z-40 hidden h-full min-h-0 shrink-0 flex-col border-r border-border/60 bg-card shadow-xl shadow-elevation/5 md:flex dark:border-border/40"
      >
        {renderContent(false)}
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="dark-surface-sidebar relative flex h-dvh w-72 max-w-[80vw] flex-col overflow-hidden border-r border-border bg-card shadow-2xl dark:border-border/40"
            >
              {renderContent(true)}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}