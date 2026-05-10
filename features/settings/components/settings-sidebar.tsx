"use client";

import { Button } from "@/shared/components/ui/button";
import { User, Bell, Shield, Wallet } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const navItems = [
  { icon: User, label: "Profile" },
  { icon: Bell, label: "Notifications" },
  { icon: Shield, label: "Security" },
  { icon: Wallet, label: "Billing" },
];

export function SettingsSidebar() {
  return (
    <div className="space-y-3">
      {navItems.map((item, i) => (
        <Button
          key={i}
          variant={i === 0 ? "default" : "ghost"}
          className={cn(
            "w-full justify-start gap-3 rounded-3xl h-14 text-sm font-semibold",
            i === 0
              ? "shadow-sm bg-primary text-white"
              : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
          )}
        >
          <item.icon className="w-5 h-5" />
          {item.label}
        </Button>
      ))}
    </div>
  );
}
