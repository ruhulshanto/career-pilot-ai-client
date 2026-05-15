'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store/auth-store';
import {
  getRoleDashboardHref,
  getWorkspaceBaseFromPath,
  resolveWorkspaceHref,
} from '@/shared/lib/role-routing';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { accessToken, hasHydrated, role, sessionKey } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (hasHydrated && !accessToken) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [accessToken, hasHydrated, pathname, router]);

  useEffect(() => {
    if (!hasHydrated || !accessToken || !role) return;

    if (pathname.startsWith('/dashboard/')) {
      const currentBase = getWorkspaceBaseFromPath(pathname, role);
      const expectedBase = getRoleDashboardHref(role);

      if (currentBase !== expectedBase) {
        // If they try to access a route belonging to another role, redirect to their role root.
        router.replace(expectedBase);
      }
    }
  }, [accessToken, hasHydrated, pathname, role, router]);

  if (!hasHydrated || !accessToken) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-foreground/40 font-black uppercase tracking-[0.2em] text-xs">Authenticating...</p>
        </div>
      </div>
    );
  }

  return <div key={sessionKey ?? "anonymous-session"} className="contents">{children}</div>;
}
