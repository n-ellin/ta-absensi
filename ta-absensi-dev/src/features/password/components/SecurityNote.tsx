import { Lock } from "lucide-react";

export function SecurityNote() {
  return (
    <p className="auth-form__note text-secondary d-flex align-items-start justify-content-center gap-2 mt-3 mb-0">
      <Lock size={14} className="flex-shrink-0" aria-hidden="true" />
      <span className="text-center">
        Kode verifikasi bersifat rahasia dan berlaku selama 5 menit.
      </span>
    </p>
  );
}
