import axios from "axios";
import type { ApiResponse } from "../interface/auth";
import type { LoginErrorType } from "../interface/loginError";

// Utama: "code" dari envelope BE
const CODE_TO_TYPE: Record<string, LoginErrorType> = {
  AUTH_INVALID_CREDENTIALS: "invalid_credentials",
  AUTH_ACCOUNT_LOCKED: "locked",
  AUTH_ACCOUNT_INACTIVE: "disabled",
  RATE_LIMITED: "rate_limited",
};

// Fallback: status HTTP
const STATUS_TO_TYPE: Record<number, LoginErrorType> = {
  401: "invalid_credentials",
  403: "disabled",
};

export function getErrorCode(error: unknown): string | undefined {
  if (!axios.isAxiosError(error)) return undefined;
  const data = error.response?.data as ApiResponse<unknown> | undefined;
  return data?.code;
}

export function getLoginErrorType(error: unknown): LoginErrorType {
  if (!axios.isAxiosError(error)) return "unknown";
  const code = getErrorCode(error);
  if (code && CODE_TO_TYPE[code]) return CODE_TO_TYPE[code];
  const status = error.response?.status;
  return (status && STATUS_TO_TYPE[status]) || "unknown";
}

export function getServerMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;
  const data = error.response?.data as ApiResponse<unknown> | undefined;
  const base = data?.message ?? fallback;
  if (data?.errors?.length) return `${base}: ${data.errors.join(", ")}`;
  return base;
}
