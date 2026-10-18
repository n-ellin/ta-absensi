// =============================================================================
// SIMULASI: BELUM TERHUBUNG KE BACKEND.
// Fungsi di bawah TIDAK melakukan HTTP call, jadi kata sandi TIDAK benar-benar
// tersimpan. Simulasi hanya aktif saat development (`import.meta.env.DEV`).
// Di build production fungsi ini sengaja melempar error supaya UI tidak pernah
// menampilkan "berhasil diperbarui" palsu.
//
// KEAMANAN: bukti bahwa OTP sudah terverifikasi harus divalidasi BACKEND
// (mis. reset token/sesi reset dari respons verifikasi OTP). Flag di
// location.state hanya mencegah salah arah di UI, bukan pengaman.
//
// TODO: saat endpoint BE siap, ganti isi `resetPassword` dengan `api.post(...)`
// sesuai kontrak (termasuk reset token dari langkah OTP), petakan "sama dengan
// kata sandi sebelumnya" ke PasswordReusedError, lalu hapus bagian simulasi.
// Invalidasi sesi lama adalah tanggung jawab backend.
// =============================================================================

/** Aktif hanya di development; dipakai halaman untuk menampilkan catatan simulasi. */
export const IS_RESET_SIMULATED = import.meta.env.DEV;

/** Kata sandi yang dianggap "sama dengan sebelumnya" pada simulasi (dev only). */
export const SIMULATED_REUSED_PASSWORD = "Password123!";

export class PasswordReusedError extends Error {
  constructor() {
    super("Kata sandi baru tidak boleh sama dengan kata sandi sebelumnya");
    this.name = "PasswordReusedError";
  }
}

const SIMULATED_LATENCY_MS = 1200;

type ForcedOutcome = "success" | "reused" | "error";
const FORCED_OUTCOMES: ForcedOutcome[] = ["success", "reused", "error"];

// Dev only: paksa hasil lewat URL, mis. /forgot-password/new-password?simulate=error
function getForcedOutcome(): ForcedOutcome | null {
  const value = new URLSearchParams(window.location.search).get("simulate");
  return FORCED_OUTCOMES.find((outcome) => outcome === value) ?? null;
}

const wait = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export async function resetPassword(
  _email: string,
  newPassword: string,
): Promise<void> {
  if (!IS_RESET_SIMULATED) {
    throw new Error("Reset kata sandi belum terhubung ke backend.");
  }

  await wait(SIMULATED_LATENCY_MS);

  const forced = getForcedOutcome();
  if (forced === "error") throw new Error("Simulasi: permintaan gagal.");
  if (forced === "reused") throw new PasswordReusedError();
  if (forced === "success") return;

  if (newPassword === SIMULATED_REUSED_PASSWORD) throw new PasswordReusedError();
}
