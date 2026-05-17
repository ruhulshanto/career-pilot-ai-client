import { create } from "zustand";
import {
  getAuthSessionKey,
  hasActiveSessionState,
  shouldRotateAuthSessionBoundary,
  type SessionRole,
  type SessionUser,
} from "@/shared/lib/session-isolation";

type AuthState = {
  accessToken: string | null;
  role: SessionRole;
  user: SessionUser | null;
  sessionKey: string | null;
  sessionVersion: number;
  hasHydrated: boolean;
  setSession: (payload: {
    accessToken: string;
    role: AuthState["role"];
    user?: AuthState["user"];
  }) => void;
  setHydrated: (hasHydrated: boolean) => void;
  clearSession: () => void;
  setUser: (user: AuthState["user"]) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  role: null,
  user: null,
  sessionKey: null,
  sessionVersion: 0,
  hasHydrated: false,
  setSession: ({ accessToken, role, user }) =>
    set((current) => {
      const nextSessionKey = getAuthSessionKey({ role, user });
      const shouldRotateBoundary = shouldRotateAuthSessionBoundary(
        current.sessionKey,
        nextSessionKey,
      );

      return {
        accessToken,
        role,
        user: user ?? null,
        sessionKey: nextSessionKey,
        sessionVersion: shouldRotateBoundary
          ? current.sessionVersion + 1
          : current.sessionVersion,
      };
    }),
  setHydrated: (hasHydrated) => set({ hasHydrated }),
  clearSession: () =>
    set((current) => {
      const hadSession = hasActiveSessionState(current);

      return {
        accessToken: null,
        role: null,
        user: null,
        sessionKey: null,
        sessionVersion: hadSession
          ? current.sessionVersion + 1
          : current.sessionVersion,
      };
    }),
  setUser: (user) =>
    set((current) => ({
      user: current.user && user ? { ...current.user, ...user } : (user ?? null),
    })),
  logout: () =>
    set((current) => {
      const hadSession = hasActiveSessionState(current);

      return {
        accessToken: null,
        role: null,
        user: null,
        sessionKey: null,
        sessionVersion: hadSession
          ? current.sessionVersion + 1
          : current.sessionVersion,
      };
    }),
}));
