import type { User } from "@/features/auth/interface/auth";

export interface AuthState {
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
