import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/core/store/authStore";
import { AuthServices } from "../services/authService";

export type BootstrapStatus = "checking" | "ready";

// Single-flight: StrictMode/dev remount tidak boleh memicu refresh ganda,
// dan proteksi terhadap race beberapa komponen memakai hook ini.
let bootstrapPromise: Promise<void> | null = null;

function runBootstrap(): Promise<void> {
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = (async () => {
    const { refreshToken } = useAuthStore.getState();
    if (!refreshToken) return;

    try {
      const res = await AuthServices.refresh({ refresh_token: refreshToken });
      if (res.success && res.data) {
        useAuthStore
          .getState()
          .setAuth(
            res.data.user,
            res.data.access_token,
            res.data.refresh_token,
            res.data.expires_in,
          );
      } else {
        useAuthStore.getState().logout();
      }
    } catch {
      // 401 AUTH_SESSION_REVOKED / AUTH_TOKEN_EXPIRED / jaringan mati →
      // sesi dianggap tidak berlaku, bersihkan lokal.
      useAuthStore.getState().logout();
    }
  })();

  return bootstrapPromise;
}

// useSessionBootstrap memvalidasi sesi tersimpan ke server SEBELUM app render.
// Tanpa ini, user dengan refresh token kedaluwarsa tetap melihat Dashboard basi
// dari localStorage sampai request pertama kena 401.
export function useSessionBootstrap(): BootstrapStatus {
  const [status, setStatus] = useState<BootstrapStatus>("checking");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    void runBootstrap().then(() => setStatus("ready"));
  }, []);

  return status;
}
