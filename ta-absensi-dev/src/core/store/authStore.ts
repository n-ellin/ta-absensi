import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState } from "../interface/authState";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      expiresAt: null,
      isAuthenticated: false,

      setAuth: (user, token, refreshToken, expiresIn) => {
        set({
          user,
          token,
          refreshToken,
          expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : null,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "e-absensi-auth", // key di localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
