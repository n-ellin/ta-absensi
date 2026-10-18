import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/core/store/authStore";
import router from "@/core/routes";
import type { ApiResponse, AuthData } from "@/features/auth/interface/auth";

type RequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ---- Request: selalu lampirkan Bearer token ----
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Refresh token (single-flight, tanpa interceptor agar tidak rekursi) ----
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) return null;

  try {
    const { data } = await axios.post<ApiResponse<AuthData>>(
      `${api.defaults.baseURL}/auth/refresh`,
      { refresh_token: refreshToken },
    );
    if (data.success && data.data) {
      const { user, access_token, refresh_token, expires_in } = data.data;
      useAuthStore
        .getState()
        .setAuth(user, access_token, refresh_token, expires_in);
      return access_token;
    }
    return null;
  } catch {
    return null;
  }
}

function redirectTo(path: string) {
  if (window.location.pathname !== path) {
    void router.navigate(path);
  }
}

// ---- Response: refresh / logout / error page ----
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const original = error.config as RequestConfig | undefined;
    const status = error.response?.status;
    const code = error.response?.data?.code;

    // Access token kedaluwarsa → refresh sekali lalu ulangi request asli
    if (
      status === 401 &&
      code === "AUTH_TOKEN_EXPIRED" &&
      original &&
      !original._retry
    ) {
      original._retry = true;

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }

      // Refresh gagal → paksa login ulang
      useAuthStore.getState().logout();
      redirectTo("/login");
      return Promise.reject(error);
    }

    // Sesi dicabut / token tidak sah → paksa login ulang
    if (
      status === 401 &&
      (code === "AUTH_SESSION_REVOKED" || code === "AUTH_UNAUTHORIZED")
    ) {
      useAuthStore.getState().logout();
      redirectTo("/login");
      return Promise.reject(error);
    }

    // Server mati / gangguan jaringan / 5xx → halaman error
    if (!error.response || (status ?? 0) >= 500) {
      redirectTo(status === 503 ? "/error/503" : "/error/500");
    }

    return Promise.reject(error);
  },
);


// ---- Refresh proaktif: jadwalkan refresh 60 detik sebelum access token habis ----
// Interceptor 401 di atas tetap menjadi fallback bila jadwal ini meleset.
const REFRESH_MARGIN_MS = 60_000;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleProactiveRefresh() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }

  const { token, refreshToken, expiresAt } = useAuthStore.getState();
  if (!token || !refreshToken || !expiresAt) return;

  const delay = Math.max(expiresAt - Date.now() - REFRESH_MARGIN_MS, 0);
  refreshTimer = setTimeout(async () => {
    const newToken = await refreshAccessToken();
    // Gagal refresh (sesi kedaluwarsa/dicabut) → paksa login ulang
    if (!newToken) {
      useAuthStore.getState().logout();
      redirectTo("/login");
    }
  }, delay);
}

// Jadwalkan ulang tiap access token / expiresAt berubah (login, refresh, logout)
useAuthStore.subscribe((state, prev) => {
  if (state.token !== prev.token || state.expiresAt !== prev.expiresAt) {
    scheduleProactiveRefresh();
  }
});
scheduleProactiveRefresh(); // saat modul dimuat (store sudah ter-hydrate dari localStorage)

export default api;
