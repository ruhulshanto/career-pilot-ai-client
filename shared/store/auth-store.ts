import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
  accessToken: string | null;
  role: "USER" | "ADMIN" | "MENTOR" | null;
  user: { name: string; email: string } | null;
  setSession: (payload: {
    accessToken: string;
    role: AuthState["role"];
    user?: AuthState["user"];
  }) => void;
  clearSession: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      role: null,
      user: null,
      setSession: ({ accessToken, role, user }) =>
        set({ accessToken, role, user }),
      clearSession: () => set({ accessToken: null, role: null, user: null }),
      logout: () => set({ accessToken: null, role: null, user: null }),
    }),
    {
      name: "career-ai-auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
