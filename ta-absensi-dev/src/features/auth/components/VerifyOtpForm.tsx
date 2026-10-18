import { useEffect, useRef } from "react";
import { Controller } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  Info,
  MailCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OtpInput } from "@/components/ui/OtpInput";
import { useVerifyOtp } from "../hooks/useVerifyOtp";
import { OTP_LENGTH } from "../schemas/verifyOtpSchema";
import { formatCountdown, maskEmail } from "../utils/otpFormat";
import { AuthFormHeader } from "./AuthFormHeader";
import { SecurityNote } from "./SecurityNote";

const FEEDBACK_ID = "otp-feedback";

interface VerifyOtpFormProps {
  email: string;
  /** Tombol "Kembali": tujuan ditentukan alur pemakai (Reset Password / Ganti Password). */
  onBack: () => void;
  /** Dipanggil setelah kode terverifikasi: lanjut ke langkah berikutnya alur pemakai. */
  onVerified?: () => void;
}

// Layar OTP universal (PRD: dipakai bersama untuk Reset Password dan Ganti Password).
export function VerifyOtpForm({ email, onBack, onVerified }: VerifyOtpFormProps) {
  const resendRef = useRef<HTMLButtonElement>(null);
  const {
    form: { control },
    onSubmit,
    onCodeEdited,
    resend,
    attemptsLeft,
    secondsLeft,
    isSubmitting,
    isResending,
    isVerified,
    isExhausted,
    isExpired,
    feedback,
    isCodeInvalid,
    isCodeMuted,
    isCodeLocked,
  } = useVerifyOtp(email, { onVerified });

  // PRD: kode kedaluwarsa -> fokus pindah ke tautan "Kirim ulang".
  // Menunggu isSubmitting selesai karena tautan masih disabled selama submit.
  useEffect(() => {
    if (isExpired && !isSubmitting) resendRef.current?.focus();
  }, [isExpired, isSubmitting]);

  return (
    <form onSubmit={onSubmit} noValidate className="auth-form">
      <AuthFormHeader icon={<MailCheck size={26} />} title="Verifikasi Kode">
        Kode {OTP_LENGTH} digit telah dikirimkan ke {maskEmail(email)}
      </AuthFormHeader>

      <Controller
        control={control}
        name="code"
        render={({ field }) => (
          <OtpInput
            value={field.value}
            onChange={(value) => {
              field.onChange(value);
              onCodeEdited();
            }}
            length={OTP_LENGTH}
            autoFocus
            invalid={isCodeInvalid}
            valid={isVerified}
            muted={isCodeMuted}
            disabled={isCodeLocked}
            describedBy={feedback ? FEEDBACK_ID : undefined}
          />
        )}
      />

      {feedback && (
        <p
          id={FEEDBACK_ID}
          className={`otp-feedback otp-feedback--${feedback.tone}`}
          role={feedback.tone === "error" ? "alert" : "status"}
        >
          {feedback.tone === "error" ? (
            <Info size={16} aria-hidden="true" />
          ) : (
            <CircleCheck size={16} aria-hidden="true" />
          )}
          <span>{feedback.message}</span>
        </p>
      )}

      <div className="auth-form__meta">
        <span className={isExhausted ? "text-danger" : undefined}>
          Sisa percobaan: {attemptsLeft} kali
        </span>

        {secondsLeft > 0 ? (
          <span
            role="timer"
            className={`auth-form__countdown ${isVerified ? "is-disabled" : ""}`}
          >
            Kirim ulang kode dalam {formatCountdown(secondsLeft)}
          </span>
        ) : (
          <button
            ref={resendRef}
            type="button"
            className="btn btn-link auth-form__link"
            onClick={resend}
            disabled={isResending || isSubmitting || isVerified}
          >
            {isResending ? "Mengirim..." : "Kirim ulang"}
          </button>
        )}
      </div>

      <Button
        type="submit"
        className={`auth-form__btn ${isExhausted ? "is-cooldown" : ""}`}
        isLoading={isSubmitting || isVerified}
        disabled={isExhausted}
      >
        {isSubmitting || isVerified ? (
          "Memproses..."
        ) : isExhausted ? (
          "Verifikasi"
        ) : (
          <>
            Verifikasi
            <ArrowRight size={16} />
          </>
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="auth-form__btn mt-2"
        onClick={onBack}
      >
        <ArrowLeft size={16} />
        Kembali
      </Button>

      <SecurityNote />
    </form>
  );
}
