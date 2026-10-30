import axios from "axios";
import api from "@/core/api/api";
import {
  clearPendingOtp,
  getPendingOtpCode,
  getRetryAfterSeconds,
  OtpRateLimitError,
} from "./forgotPasswordService";

/**
 * Simulasi sudah dihapus; service terhubung ke backend asli.
 * Konstanta tetap diekspor agar impor halaman tidak berubah.
 */
export const IS_RESET_SIMULATED = false;

export const SIMULATED_REUSED_PASSWORD = "Password123!";

export class PasswordReusedError extends Error {
  constructor() {
    super("Kata sandi baru tidak boleh sama dengan kata sandi sebelumnya");
    this.name = "PasswordReusedError";
  }
}

interface ApiErrorBody {
  code?: string;
  message?: string;
}

// Hanya RATE_LIMITED yang dipetakan ke OtpRateLimitError. OTP_INVALID,
// OTP_EXPIRED, dan OTP_TOO_MANY_ATTEMPTS diteruskan sebagai axios error apa
// adanya sehingga getServerMessage menampilkan pesan backend.
function mapResetError(error: unknown): unknown {
  if (!axios.isAxiosError(error) || !error.response) return error;

  const body = error.response.data as ApiErrorBody | undefined;
  if (error.response.status === 429 && body?.code === "RATE_LIMITED") {
    return new OtpRateLimitError(getRetryAfterSeconds(error), body.message);
  }
  return error;
}

/**
 * Reset password lewat endpoint gabungan backend (verifikasi OTP + simpan
 * kata sandi baru sekaligus). Kode OTP diambil dari langkah verifikasi;
 * error backend (OTP_INVALID / OTP_EXPIRED / OTP_TOO_MANY_ATTEMPTS) tidak
 * dipetakan agar getServerMessage menampilkan pesannya. Hanya RATE_LIMITED
 * yang menjadi OtpRateLimitError. Invalidasi sesi lama dilakukan backend.
 */
export async function resetPassword(
  email: string,
  newPassword: string,
): Promise<void> {
  const code = getPendingOtpCode(email);
  if (!code) {
    throw new Error(
      "Kode OTP belum diverifikasi. Silakan minta kode baru dan ulangi verifikasi.",
    );
  }

  try {
    await api.post("/auth/forgot-password/verify", {
      email,
      code,
      new_password: newPassword,
    });
  } catch (error) {
    throw mapResetError(error);
  }

  // Kode terpakai (sekali pakai); jangan tinggal di memori.
  clearPendingOtp();
}
