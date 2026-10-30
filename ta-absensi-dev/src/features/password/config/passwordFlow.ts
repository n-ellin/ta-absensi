// =============================================================================
// Konfigurasi alur kata sandi yang dipakai BERSAMA oleh dua pintu masuk:
//   - "forgot": Lupa Kata Sandi, dimulai dari halaman Login (belum login).
//   - "change": Ganti Kata Sandi, dimulai dari Pengaturan Akun (sudah login).
//
// Tiga langkahnya sama (Surel -> Kode OTP -> Sandi Baru), jadi halaman, form,
// hook, dan schema-nya dipakai ulang. Yang berbeda hanya data di file ini:
// rute, tujuan tombol kembali, dan teks.
//
// CATATAN BACKEND (belum ada, jadi belum diintegrasikan):
// Kedua alur punya konteks autentikasi yang berbeda. Pada "change", pengguna
// sudah login, sehingga BE seharusnya mengambil identitas akun dari token/sesi
// dan TIDAK menerima surel dari klien. Pada "forgot", pengguna anonim dan surel
// berasal dari input. Saat endpoint BE siap, service di
// `services/forgotPasswordService.ts` dan `services/resetPasswordService.ts`
// perlu membedakan kedua alur ini (mis. menerima parameter `flow`).
// =============================================================================

export type PasswordFlow = "forgot" | "change";

export const PASSWORD_FLOW_STEPS = ["Surel", "Kode OTP", "Sandi Baru"];

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

export const PASSWORD_FLOWS: Record<PasswordFlow, PasswordFlowConfig> = {
  forgot: {
    usesAccountEmail: false,
    paths: {
      start: "/forgot-password",
      verify: "/forgot-password/verify",
      newPassword: "/forgot-password/new-password",
    },
    exitPath: "/login",
    start: {
      title: "Lupa kata sandi?",
      description:
        "Masukkan surel yang terdaftar pada akun Anda. Kami akan mengirimkan kode OTP verifikasi.",
      sentMessage:
        "Jika surel terdaftar di sistem, kode verifikasi telah dikirimkan ke surel Anda.",
      backLabel: "Kembali ke halaman masuk",
    },
    success: {
      description: "Silakan masuk menggunakan kata sandi baru Anda.",
      buttonLabel: "Kembali ke Halaman Masuk",
    },
  },
  change: {
    usesAccountEmail: true,
    paths: {
      start: "/change-password",
      verify: "/change-password/verify",
      newPassword: "/change-password/new-password",
    },
    // TODO: arahkan ke Pengaturan Akun saat halamannya sudah ada. Sementara ke
    // "/" (tujuan sementara yang sama dengan useLogin).
    exitPath: "/",
    start: {
      title: "Ganti Kata Sandi",
      description:
        "Demi keamanan akun, kami akan mengirim kode verifikasi ke surel Anda sebelum Anda dapat mengganti kata sandi.",
      sentMessage: "Kode verifikasi telah dikirimkan ke surel Anda.",
      backLabel: "Kembali",
    },
    // Figma layar selesai untuk alur ini belum dilampirkan; teks mengikuti
    // pola layar selesai Lupa Kata Sandi. Tidak diasumsikan sesi di-logout
    // karena itu keputusan/kontrak backend.
    success: {
      description: "Kata sandi akun Anda telah diperbarui.",
      buttonLabel: "Selesai",
    },
  },
};

/** Hanya dev: surel akun pengganti karena login belum mengisi authStore. */
export const DEV_ACCOUNT_EMAIL = "guru.rpl@smk.belajar.id";
