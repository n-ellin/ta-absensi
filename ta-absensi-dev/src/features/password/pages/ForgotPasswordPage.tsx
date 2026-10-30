import { Navigate, useLocation } from "react-router-dom";
import { AuthCenteredLayout } from "@/components/layout/AuthCenteredLayout";
import { Stepper } from "@/components/ui/Stepper";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";
import {
  DEV_ACCOUNT_EMAIL,
  PASSWORD_FLOWS,
  PASSWORD_FLOW_STEPS,
  type PasswordFlow,
} from "../config/passwordFlow";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { IS_OTP_SIMULATED } from "../services/forgotPasswordService";

interface ForgotPasswordPageProps {
  /** "forgot" (default) untuk /forgot-password, "change" untuk /change-password. */
  flow?: PasswordFlow;
}

// Langkah 1 universal untuk Lupa Kata Sandi dan Ganti Kata Sandi.
export default function ForgotPasswordPage({
  flow = "forgot",
}: ForgotPasswordPageProps) {
  const { user } = useAuth();
  const location = useLocation();
  const config = PASSWORD_FLOWS[flow];

  // Ganti Kata Sandi memakai surel akun yang login, bukan input pengguna.
  // Login belum mengisi authStore (lihat useLogin), jadi di dev dipakai surel
  // contoh agar halaman bisa diuji. Di production tanpa akun -> ke Login.
  const accountEmail = config.usesAccountEmail
    ? (user?.email ?? (IS_OTP_SIMULATED ? DEV_ACCOUNT_EMAIL : undefined))
    : undefined;

  if (config.usesAccountEmail && !accountEmail) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <AuthCenteredLayout
      header={<Stepper steps={PASSWORD_FLOW_STEPS} currentStep={0} />}
      footer={
        IS_OTP_SIMULATED && (
          <p className="text-secondary small mb-0">
            Mode simulasi: halaman ini belum terhubung ke backend, jadi tidak
            ada kode OTP yang benar-benar dikirim. Tambahkan{" "}
            <code>?simulate=limit</code> atau <code>?simulate=error</code> di
            URL untuk menguji state lain.
          </p>
        )
      }
    >
      <ForgotPasswordForm flow={flow} accountEmail={accountEmail} />
    </AuthCenteredLayout>
  );
}
