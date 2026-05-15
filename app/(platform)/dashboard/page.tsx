"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/auth-store";
import { getRoleDashboardHref } from "@/shared/lib/role-routing";

export default function DashboardPage() {
  const router = useRouter();
  const role = useAuthStore((state) => state.role);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    router.replace(getRoleDashboardHref(role));
  }, [hasHydrated, role, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
      Opening your workspace...
    </div>
  );
}
