import { create } from "zustand";
import { persist } from "zustand/middleware";

// We never store the JWT itself here — it lives in an httpOnly cookie the
// backend sets on login. This store only tracks whether we believe there's
// an active session and who it belongs to, purely for UI state.
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      clear: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "portfolio-auth" },
  ),
);
