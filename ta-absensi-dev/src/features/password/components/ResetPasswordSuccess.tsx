import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AuthFormHeader } from "./AuthFormHeader";

interface ResetPasswordSuccessProps {
  onContinue: () => void;
  /** Teks di bawah judul; default untuk alur Lupa Kata Sandi. */
  description?: string;
  /** Label tombol; default untuk alur Lupa Kata Sandi. */
  buttonLabel?: string;
}

// Layar "selesai" dari Figma. Hanya dirender setelah service mengembalikan sukses.
export function ResetPasswordSuccess({
  onContinue,
  description = "Silakan masuk menggunakan kata sandi baru Anda.",
  buttonLabel = "Kembali ke Halaman Masuk",
}: ResetPasswordSuccessProps) {
  return (
    <div className="auth-form" role="status">
      <AuthFormHeader
        icon={<Check size={26} />}
        iconClassName="auth-form__icon--success"
        title="Kata sandi berhasil diperbarui"
      >
        {description}
      </AuthFormHeader>

      <Button type="button" className="auth-form__btn" onClick={onContinue}>
        {buttonLabel}
      </Button>
    </div>
  );
}
