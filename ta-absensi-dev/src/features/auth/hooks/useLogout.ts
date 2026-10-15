import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/core/store/authStore";
import { AuthServices } from "../services/authService";

export function useLogout() {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const clearAuth = useAuthStore((s) => s.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const finish = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (token && refreshToken) {
await AuthServices.logout({ refresh_token: refreshToken });
      }
    } catch {
      // Token mungkin sudah tidak valid — sesi lokal tetap dibersihkan
    } finally {
      finish();
    }
  };

  const handleLogoutAll = async () => {
    setIsLoggingOut(true);
    try {
  if (token) await AuthServices.logoutAll();
    } catch {
      // Abaikan — sesi lokal tetap dibersihkan
    } finally {
      finish();
    }
  };

  return { handleLogout, handleLogoutAll, isLoggingOut };
}
