// Klasifikasi error login berdasarkan "code" envelope BE / status HTTP.

export type LoginErrorType =
  | "invalid_credentials"
  | "locked"
  | "disabled"
  | "rate_limited"
  | "unknown";
