import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas/forgotPasswordSchema";
import {
  OtpRateLimitError,
  requestPasswordResetOtp,
} from "../services/forgotPasswordService";
import { getServerMessage } from "../utils/authError";

export type ForgotPasswordStatus =
  | { type: "idle" }
  | { type: "sent"; email: string }
  | { type: "rate_limited"; retryAfterSeconds: number }
  | { type: "failed"; message: string };

const FAILED_FALLBACK_MESSAGE =
  "Gagal mengirim kode verifikasi, coba lagi beberapa saat.";

// Alert sukses ditampilkan sebentar sebelum pindah ke langkah "Kode OTP".
const SENT_ALERT_DURATION_MS = 1500;

interface UseForgotPasswordOptions {
  /** Rute langkah 2 (Kode OTP) milik alur pemakai. */
  verifyPath: string;
  /** Surel awal; diisi pada alur Ganti Kata Sandi (surel akun yang login). */
  defaultEmail?: string;
}

export function useForgotPassword({
  verifyPath,
  defaultEmail = "",
}: UseForgotPasswordOptions) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<ForgotPasswordStatus>({ type: "idle" });

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: defaultEmail },
  });

  // Saat kena limit, tombol dikunci sampai masa tunggu habis.
  useEffect(() => {
    if (status.type !== "rate_limited") return undefined;

    const timer = window.setTimeout(
      () => setStatus({ type: "idle" }),
      status.retryAfterSeconds * 1000,
    );
    return () => window.clearTimeout(timer);
  }, [status]);

  // Setelah sukses, lanjut ke langkah 2 membawa surel. Submit ulang membatalkannya.
  useEffect(() => {
    if (status.type !== "sent") return undefined;

    const timer = window.setTimeout(
      () => navigate(verifyPath, { state: { email: status.email } }),
      SENT_ALERT_DURATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, [status, navigate, verifyPath]);

  const onSubmit = form.handleSubmit(async ({ email }) => {
    setStatus({ type: "idle" });

    try {
      await requestPasswordResetOtp(email);
      setStatus({ type: "sent", email });
    } catch (error) {
      if (error instanceof OtpRateLimitError) {
        setStatus({
          type: "rate_limited",
          retryAfterSeconds: error.retryAfterSeconds,
        });
        return;
      }
      setStatus({
        type: "failed",
        message: getServerMessage(error, FAILED_FALLBACK_MESSAGE),
      });
    }
  });

  return {
    form,
    onSubmit,
    status,
    isSubmitting: form.formState.isSubmitting,
    isCooldown: status.type === "rate_limited",
  };
}
