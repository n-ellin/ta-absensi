// Kontrak data layanan OTP (kirim / verifikasi / reset kata sandi).

/** Body error standar backend yang dipetakan oleh service OTP. */
export interface ApiErrorBody {
  code?: string;
  message?: string;
}

export interface RequestOtpOptions {
  /** Kirim ulang dari layar verifikasi: cooldown dihitung backend. */
  isResend?: boolean;
}

/** Kode OTP yang menunggu verifikasi untuk satu surel (disimpan di memori). */
export interface PendingOtp {
  email: string;
  code: string;
}

export type ForgotPasswordStatus =
  | { type: "idle" }
  | { type: "sent"; email: string }
  | { type: "rate_limited"; retryAfterSeconds: number }
  | { type: "failed"; message: string };

export type VerifyOtpStatus =
  | { type: "idle" }
  | { type: "verified" }
  | { type: "invalid" }
  | { type: "expired" }
  | { type: "exhausted" }
  | { type: "rate_limited" }
  | { type: "failed"; message: string };

export interface VerifyOtpFeedback {
  tone: "error" | "success";
  message: string;
}
