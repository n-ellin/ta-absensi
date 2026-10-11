import axios from "axios";

export type LoginErrorType =
  | "invalid_credentials"
  | "locked"
  | "disabled"
  | "unknown";

// ASUMSI SEMENTARA (BE belum ada): 401 salah kredensial, 429 terkunci, 403 nonaktif.
// Cukup ubah di file ini saat kontrak BE sudah pasti.
const STATUS_TO_TYPE: Record<number, LoginErrorType> = {
  401: "invalid_credentials",
  429: "locked",
  403: "disabled",
};

export function getLoginErrorType(error: unknown): LoginErrorType {
  if (!axios.isAxiosError(error)) return "unknown";
  const status = error.response?.status;
  return (status && STATUS_TO_TYPE[status]) || "unknown";
}

export function getServerMessage(error: unknown, fallback: string) {
  return axios.isAxiosError(error)
    ? (error.response?.data?.message ?? fallback)
    : fallback;
}
