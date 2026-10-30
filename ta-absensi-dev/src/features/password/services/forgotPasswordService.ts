import axios from "axios";
import api from "@/core/api/api";

export const OTP_COOLDOWN_SECONDS = 60;
export const OTP_MAX_ATTEMPTS = 3;

/**
 * Simulasi sudah dihapus; service terhubung ke backend asli.
 * Konstanta tetap diekspor agar impor halaman tidak berubah; nilai `false`
 * membuat catatan simulasi di halaman tidak tampil.
 */
export const IS_OTP_SIMULATED = false;

export const SIMULATED_VALID_CODE = "123456";
export const SIMULATED_EXPIRED_CODE = "000000";

export class OtpRateLimitError extends Error {
  readonly retryAfterSeconds: number;

  constructor(
    retryAfterSeconds: number = OTP_COOLDOWN_SECONDS,
    message?: string,
  ) {
    super(message ?? "Terlalu sering meminta kode verifikasi");
    this.name = "OtpRateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class OtpInvalidError extends Error {
  constructor(message?: string) {
    super(message ?? "Kode OTP tidak valid");
    this.name = "OtpInvalidError";
  }
}

export class OtpExpiredError extends Error {
  constructor(message?: string) {
    super(message ?? "Kode OTP telah kedaluwarsa");
    this.name = "OtpExpiredError";
  }
}

interface ApiErrorBody {
  code?: string;
  message?: string;
}

/** Detik tunggu dari header `Retry-After`, lalu pesan "tunggu N detik", lalu default. */
export function getRetryAfterSeconds(error: unknown): number {
  if (!axios.isAxiosError(error)) return OTP_COOLDOWN_SECONDS;

  const headers = error.response?.headers as
    | Record<string, unknown>
    | undefined;
  const fromHeader = Number(headers?.["retry-after"]);
  if (Number.isFinite(fromHeader) && fromHeader > 0) return fromHeader;

  const message = (error.response?.data as ApiErrorBody | undefined)?.message;
  const match = message ? /tunggu\s+(\d+)\s*detik/i.exec(message) : null;
  if (match) return Number(match[1]);

  return OTP_COOLDOWN_SECONDS;
}

function getErrorMessage(error: unknown): string | undefined {
  return axios.isAxiosError(error)
    ? (error.response?.data as ApiErrorBody | undefined)?.message
    : undefined;
}

interface RequestOtpOptions {
  /** Kirim ulang dari layar verifikasi: cooldown dihitung backend. */
  isResend?: boolean;
}

// Hanya 429 yang berarti "tunggu sebentar lalu coba lagi" yang dipetakan ke
// OtpRateLimitError. OTP_RESEND_LIMIT (kuota per jam) dan 429 lain diteruskan
// sebagai axios error agar getServerMessage menampilkan pesan backend.
function isCooldownRateLimit(error: unknown): boolean {
  if (!axios.isAxiosError(error) || error.response?.status !== 429) {
    return false;
  }
  const code = (error.response.data as ApiErrorBody | undefined)?.code;
  return code === "OTP_RESEND_TOO_SOON" || code === "RATE_LIMITED";
}

export async function requestPasswordResetOtp(
  email: string,
  options: RequestOtpOptions = {},
): Promise<void> {
  try {
    await api.post(
      options.isResend
        ? "/auth/forgot-password/resend"
        : "/auth/forgot-password",
      { email },
    );
  } catch (error) {
    if (isCooldownRateLimit(error)) {
      throw new OtpRateLimitError(
        getRetryAfterSeconds(error),
        getErrorMessage(error),
      );
    }
    throw error;
  }

  // Kode lama sudah di-invalidate backend saat kirim ulang berhasil.
  if (options.isResend) clearPendingOtp();
}

// Backend memvalidasi OTP bersamaan dengan penyimpanan kata sandi baru
// (endpoint gabungan verify+reset), jadi verifikasi HTTP baru terjadi saat
// `resetPassword` dipanggil. Langkah verifikasi menyimpan kode di sini.
interface PendingOtp {
  email: string;
  code: string;
}

let pendingOtp: PendingOtp | null = null;

/** Kode OTP tersimpan untuk surel terkait; null bila belum ada atau surel berbeda. */
export function getPendingOtpCode(email: string): string | null {
  return pendingOtp?.email === email ? pendingOtp.code : null;
}

/** Buang kode OTP tersimpan (setelah reset sukses atau kirim ulang berhasil). */
export function clearPendingOtp(): void {
  pendingOtp = null;
}

export async function verifyPasswordResetOtp(
  email: string,
  code: string,
): Promise<void> {
  pendingOtp = { email, code };
}
