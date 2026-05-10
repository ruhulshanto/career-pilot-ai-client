'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store/auth-store';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { accessToken, role } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.replace('/login');
    }
  }, [accessToken, router]);

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-foreground/40 font-black uppercase tracking-[0.2em] text-xs">Authenticating...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
