import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../../features/auth/interface/auth";

interface AuthState {
  user: User | null;
  token: string | null; // access token
  refreshToken: string | null;
  expiresAt: number | null; // epoch ms kapan access token habis (dari expires_in)
  isAuthenticated: boolean;

  setAuth: (
    user: User,
    token: string,
    refreshToken: string,
    expiresIn?: number,
  ) => void;
  logout: () => void;
}

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
