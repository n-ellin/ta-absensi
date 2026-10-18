// =============================================================================
// SIMULASI: BELUM TERHUBUNG KE BACKEND.
// File ini tidak melakukan HTTP call apa pun, sehingga TIDAK ADA OTP yang
// benar-benar dikirim dan TIDAK ADA kode yang benar-benar diverifikasi.
// Tujuannya hanya agar state UI (loading, sukses, limit, gagal, kode salah,
// kedaluwarsa) bisa diuji tanpa API.
//
// Simulasi hanya aktif saat development (`import.meta.env.DEV`). Di build
// production, kedua fungsi di bawah sengaja melempar error supaya UI tidak
// pernah menampilkan "kode terkirim" atau "kode terverifikasi" palsu.
//
// TODO: saat endpoint BE siap, ganti isi `requestPasswordResetOtp` dan
// `verifyPasswordResetOtp` dengan pemanggilan `api.post(...)`, petakan respons
// BE ke error di bawah (429 -> OtpRateLimitError, kode salah ->
// OtpInvalidError, kedaluwarsa -> OtpExpiredError), lalu hapus bagian simulasi.
// =============================================================================

export const OTP_COOLDOWN_SECONDS = 60;
export const OTP_MAX_ATTEMPTS = 3;

/** Aktif hanya di development; dipakai halaman untuk menampilkan catatan simulasi. */
export const IS_OTP_SIMULATED = import.meta.env.DEV;

/** Kode simulasi (dev only): benar / kedaluwarsa. Kode lain dianggap tidak valid. */
export const SIMULATED_VALID_CODE = "123456";
export const SIMULATED_EXPIRED_CODE = "000000";

export class OtpRateLimitError extends Error {
  readonly retryAfterSeconds: number;

  constructor(retryAfterSeconds: number = OTP_COOLDOWN_SECONDS) {
    super("Terlalu sering meminta kode verifikasi");
    this.name = "OtpRateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class OtpInvalidError extends Error {
  constructor() {
    super("Kode OTP tidak valid");
    this.name = "OtpInvalidError";
  }
}

export class OtpExpiredError extends Error {
  constructor() {
    super("Kode OTP telah kedaluwarsa");
    this.name = "OtpExpiredError";
  }
}

const SIMULATED_LATENCY_MS = 1200;

// Waktu permintaan terakhir yang "berhasil" (hanya di memori, hilang saat refresh).
let lastSimulatedRequestAt: number | null = null;

type ForcedOutcome =
  | "sent"
  | "limit"
  | "error"
  | "valid"
  | "invalid"
  | "expired";

const FORCED_OUTCOMES: ForcedOutcome[] = [
  "sent",
  "limit",
  "error",
  "valid",
  "invalid",
  "expired",
];

// Dev only: paksa hasil lewat URL, mis. /forgot-password?simulate=limit
function getForcedOutcome(): ForcedOutcome | null {
  const value = new URLSearchParams(window.location.search).get("simulate");
  return FORCED_OUTCOMES.find((outcome) => outcome === value) ?? null;
}

const wait = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

interface RequestOtpOptions {
  /** Kirim ulang dari layar verifikasi: UI sudah menahan lewat countdown. */
  isResend?: boolean;
}

export async function requestPasswordResetOtp(
  _email: string,
  options: RequestOtpOptions = {},
): Promise<void> {
  if (!IS_OTP_SIMULATED) {
    throw new Error("Pengiriman OTP belum terhubung ke backend.");
  }

  await wait(SIMULATED_LATENCY_MS);

  const forced = getForcedOutcome();
  if (forced === "error") {
    throw new Error("Simulasi: permintaan gagal.");
  }

  const now = Date.now();
  const isWithinCooldown =
    !options.isResend &&
    lastSimulatedRequestAt !== null &&
    now - lastSimulatedRequestAt < OTP_COOLDOWN_SECONDS * 1000;

  // Tanpa ?simulate: permintaan kedua dalam 60 detik terkena limit,
  // meniru alur Figma (terkirim, lalu minta lagi terlalu cepat).
  // Kirim ulang dari layar verifikasi tidak kena limit simulasi; gunakan
  // ?simulate=limit untuk menguji alert limit di sana.
  if (forced === "limit" || (forced !== "sent" && isWithinCooldown)) {
    throw new OtpRateLimitError();
  }

  lastSimulatedRequestAt = now;
}

export async function verifyPasswordResetOtp(
  _email: string,
  code: string,
): Promise<void> {
  if (!IS_OTP_SIMULATED) {
    throw new Error("Verifikasi OTP belum terhubung ke backend.");
  }

  await wait(SIMULATED_LATENCY_MS);

  const forced = getForcedOutcome();
  if (forced === "error") {
    throw new Error("Simulasi: permintaan gagal.");
  }

  const outcome =
    forced === "valid" || forced === "invalid" || forced === "expired"
      ? forced
      : code === SIMULATED_VALID_CODE
        ? "valid"
        : code === SIMULATED_EXPIRED_CODE
          ? "expired"
          : "invalid";

  if (outcome === "expired") throw new OtpExpiredError();
  if (outcome === "invalid") throw new OtpInvalidError();
}
