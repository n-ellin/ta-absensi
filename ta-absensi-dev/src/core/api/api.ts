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
      const { user, access_token, refresh_token } = data.data;
      useAuthStore.getState().setAuth(user, access_token, refresh_token);
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

export default api;
