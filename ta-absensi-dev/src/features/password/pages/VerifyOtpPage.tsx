import { useEffect, useRef } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthCenteredLayout } from "@/components/layout/AuthCenteredLayout";
import { Stepper } from "@/components/ui/Stepper";
import { VerifyOtpForm } from "../components/VerifyOtpForm";
import {
  PASSWORD_FLOWS,
  PASSWORD_FLOW_STEPS,
} from "../config/passwordFlow";
import type { PasswordFlow } from "../interface";
import {
  IS_OTP_SIMULATED,
  SIMULATED_EXPIRED_CODE,
  SIMULATED_VALID_CODE,
} from "../services/forgotPasswordService";

// Hanya dev: agar halaman ini bisa dibuka langsung lewat URL tanpa lewat langkah 1.
const DEV_FALLBACK_EMAIL = "k@gmail.com";

// Pesan "Kode berhasil diverifikasi" ditampilkan sebentar sebelum pindah langkah.
const VERIFIED_ALERT_DURATION_MS = 1000;

interface VerifyOtpPageProps {
  /** "forgot" (default) untuk /forgot-password/verify, "change" untuk /change-password/verify. */
  flow?: PasswordFlow;
}

// Langkah 2 universal untuk Lupa Kata Sandi dan Ganti Kata Sandi.
export default function VerifyOtpPage({ flow = "forgot" }: VerifyOtpPageProps) {
  const config = PASSWORD_FLOWS[flow];
  const location = useLocation();
  const navigate = useNavigate();
  const stateEmail = (location.state as { email?: string } | null)?.email;
  const email = stateEmail ?? (IS_OTP_SIMULATED ? DEV_FALLBACK_EMAIL : undefined);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  // Tanpa surel (mis. halaman di-refresh) tidak ada kode yang bisa diverifikasi.
  if (!email) return <Navigate to={config.paths.start} replace />;

  return (
    <AuthCenteredLayout
      header={<Stepper steps={PASSWORD_FLOW_STEPS} currentStep={1} />}
      footer={
        IS_OTP_SIMULATED && (
          <p className="text-secondary small mb-0">
            Mode simulasi: belum terhubung ke backend, jadi tidak ada kode yang
            benar-benar dikirim atau diverifikasi. Kode{" "}
            <code>{SIMULATED_VALID_CODE}</code> dianggap benar,{" "}
            <code>{SIMULATED_EXPIRED_CODE}</code> kedaluwarsa, kode lain tidak
            valid. Tambahkan <code>?simulate=error</code>,{" "}
            <code>?simulate=limit</code>, <code>?simulate=invalid</code>,{" "}
            <code>?simulate=expired</code>, atau <code>?simulate=valid</code> di
            URL untuk memaksa hasil.
          </p>
        )
      }
    >
      <VerifyOtpForm
        email={email}
        onBack={() => navigate(config.paths.start)}
        onVerified={() => {
          timerRef.current = window.setTimeout(
            () =>
              navigate(config.paths.newPassword, {
                replace: true,
                state: { email, otpVerified: true },
              }),
            VERIFIED_ALERT_DURATION_MS,
          );
        }}
      />
    </AuthCenteredLayout>
  );
}
