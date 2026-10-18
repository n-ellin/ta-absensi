import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthCenteredLayout } from "@/components/layout/AuthCenteredLayout";
import { Stepper } from "@/components/ui/Stepper";
import { ResetPasswordForm } from "../components/ResetPasswordForm";
import { ResetPasswordSuccess } from "../components/ResetPasswordSuccess";
import {
  PASSWORD_FLOWS,
  PASSWORD_FLOW_STEPS,
  type PasswordFlow,
} from "../config/passwordFlow";
import {
  IS_RESET_SIMULATED,
  SIMULATED_REUSED_PASSWORD,
} from "../services/resetPasswordService";

export interface ResetPasswordLocationState {
  email: string;
  otpVerified: true;
}

function isResetState(state: unknown): state is ResetPasswordLocationState {
  const value = state as Partial<ResetPasswordLocationState> | null;
  return Boolean(value?.otpVerified && typeof value.email === "string");
}

interface ResetPasswordPageProps {
  /** "forgot" (default) untuk /forgot-password/new-password, "change" untuk /change-password/new-password. */
  flow?: PasswordFlow;
}

// Langkah 3 universal untuk Lupa Kata Sandi dan Ganti Kata Sandi.
export default function ResetPasswordPage({
  flow = "forgot",
}: ResetPasswordPageProps) {
  const config = PASSWORD_FLOWS[flow];
  const location = useLocation();
  const navigate = useNavigate();
  const [isDone, setIsDone] = useState(false);

  // Hanya kenyamanan UI: tanpa langkah OTP, kembalikan ke awal alur.
  // Keamanan sebenarnya harus divalidasi backend (lihat resetPasswordService).
  if (!isResetState(location.state)) {
    return <Navigate to={config.paths.start} replace />;
  }

  return (
    <AuthCenteredLayout
      // Setelah selesai, semua langkah tampil dengan centang (sesuai Figma).
      header={
        <Stepper
          steps={PASSWORD_FLOW_STEPS}
          currentStep={isDone ? PASSWORD_FLOW_STEPS.length : 2}
        />
      }
      footer={
        IS_RESET_SIMULATED && (
          <p className="text-secondary small mb-0">
            Mode simulasi: belum terhubung ke backend, jadi kata sandi tidak
            benar-benar tersimpan. Kata sandi <code>{SIMULATED_REUSED_PASSWORD}</code>{" "}
            dianggap sama dengan sebelumnya. Tambahkan{" "}
            <code>?simulate=success</code>, <code>?simulate=reused</code>, atau{" "}
            <code>?simulate=error</code> di URL untuk memaksa hasil.
          </p>
        )
      }
    >
      {isDone ? (
        <ResetPasswordSuccess
          description={config.success.description}
          buttonLabel={config.success.buttonLabel}
          onContinue={() => navigate(config.exitPath, { replace: true })}
        />
      ) : (
        <ResetPasswordForm
          email={location.state.email}
          onSuccess={() => setIsDone(true)}
        />
      )}
    </AuthCenteredLayout>
  );
}
