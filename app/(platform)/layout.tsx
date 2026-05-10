import type { ReactNode } from "react";

import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function PlatformLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="h-dvh overflow-hidden bg-background">{children}</div>
    </AuthGuard>
  );
}
