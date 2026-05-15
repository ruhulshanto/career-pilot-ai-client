"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { User, Bell, Shield, Wallet } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useWorkspaceBase } from "@/shared/hooks/use-workspace-base";
import { getWorkspaceHref } from "@/shared/lib/role-routing";
import { ThemeModeToggle } from "@/shared/components/theme/theme-mode-toggle";

const navItems = [
  { icon: User, label: "Profile", path: "settings/profile" },
  { icon: Bell, label: "Notifications", path: "settings/notifications" },
  { icon: Shield, label: "Security", path: "settings/security" },
  { icon: Wallet, label: "Billing", path: "settings/billing" },
];

export function SettingsSidebar() {
  const pathname = usePathname();
  const workspaceBase = useWorkspaceBase();
  const settingsHref = getWorkspaceHref(workspaceBase, "settings");

  return (
    <nav aria-label="Settings sections" className="lg:sticky lg:top-24">
      <div className="grid grid-cols-2 gap-3 lg:block lg:space-y-3">
        {navItems.map((item) => {
          const href = getWorkspaceHref(workspaceBase, item.path);
          const active =
            pathname === href ||
            (item.path.endsWith("/profile") && pathname === settingsHref);

          return (
            <Button
              key={item.path}
              asChild
              variant={active ? "default" : "ghost"}
              className={cn(
                "h-12 w-full justify-start gap-3 rounded-2xl text-sm font-semibold transition-all lg:h-14",
                active
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/15"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <Link href={href}>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </Button>
          );
        })}
      </div>
      <ThemeModeToggle className="mt-4 hidden lg:block" label="Appearance" />
    </nav>
  );
}
