// Kontrak tipe alur Lupa Kata Sandi / Ganti Kata Sandi.
// Konstanta konfigurasi (PASSWORD_FLOWS, dll.) tetap di config/passwordFlow.ts.

export type PasswordFlow = "forgot" | "change";

export interface PasswordFlowConfig {
  /** true: surel diambil dari akun yang sedang login dan tidak bisa diubah. */
  usesAccountEmail: boolean;
  paths: {
    start: string;
    verify: string;
    newPassword: string;
  };
  /** Tujuan tombol "Kembali" di langkah 1 dan tombol di layar selesai. */
  exitPath: string;
  start: {
    title: string;
    description: string;
    sentMessage: string;
    backLabel: string;
  };
  success: {
    description: string;
    buttonLabel: string;
  };
}

/** State router yang dibawa langkah OTP ke langkah Sandi Baru. */
export interface ResetPasswordLocationState {
  email: string;
  otpVerified: true;
}
