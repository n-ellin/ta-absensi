// Kontrak opsi parameter hook pada fitur password.

export interface UseForgotPasswordOptions {
  /** Rute langkah 2 (Kode OTP) milik alur pemakai. */
  verifyPath: string;
  /** Surel awal; diisi pada alur Ganti Kata Sandi (surel akun yang login). */
  defaultEmail?: string;
}

export interface UseVerifyOtpOptions {
  /** Dipanggil setelah kode terverifikasi; pemakai menentukan langkah berikutnya. */
  onVerified?: () => void;
}

export interface UseResetPasswordOptions {
  /** Dipanggil hanya setelah service mengembalikan sukses. */
  onSuccess: () => void;
}
