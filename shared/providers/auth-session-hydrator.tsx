"use client";

import { useEffect, type PropsWithChildren } from "react";

import { authApi, type AuthUser } from "@/services/auth/auth-api";
import { useAuthStore } from "@/shared/store/auth-store";

const normalizeUser = (user: AuthUser) => ({
  id: user.id,
  name:
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.firstName ||
    "User",
  email: user.email,
});

export function AuthSessionHydrator({ children }: PropsWithChildren) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setHydrated = useAuthStore((state) => state.setHydrated);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    let cancelled = false;

    const hydrateSession = async () => {
      if (useAuthStore.getState().accessToken) {
        setHydrated(true);
        return;
      }

      setHydrated(false);

      try {
        const response = await authApi.refresh();
        if (cancelled) return;

        setSession({
          accessToken: response.data.accessToken,
          role: response.data.user.role,
          user: normalizeUser(response.data.user),
        });
      } catch {
        if (cancelled) return;

        if (!useAuthStore.getState().accessToken) {
          clearSession();
        }
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    };

    void hydrateSession();

    return () => {
      cancelled = true;
    };
  }, [clearSession, setHydrated, setSession]);

  useEffect(() => {
    if (accessToken) {
      setHydrated(true);
    }
  }, [accessToken, setHydrated]);

  return <>{children}</>;
}
