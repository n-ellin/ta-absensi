import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  verifyOtpSchema,
  type VerifyOtpFormValues,
} from "../schemas/verifyOtpSchema";
import {
  OTP_COOLDOWN_SECONDS,
  OTP_MAX_ATTEMPTS,
  OtpExpiredError,
  OtpInvalidError,
  OtpRateLimitError,
  requestPasswordResetOtp,
  verifyPasswordResetOtp,
} from "../services/forgotPasswordService";
import { getServerMessage } from "@/features/auth/utils/authError";

export type VerifyOtpStatus =
  | { type: "idle" }
  | { type: "verified" }
  | { type: "invalid" }
  | { type: "expired" }
  | { type: "exhausted" }
  | { type: "rate_limited" }
  | { type: "failed"; message: string };

export interface VerifyOtpFeedback {
  tone: "error" | "success";
  message: string;
}

const MESSAGES = {
  verified: "Kode berhasil diverifikasi",
  invalid: "Kode OTP tidak valid. Silakan periksa kembali",
  expired: "Kode OTP telah kedaluwarsa. Silakan minta kode baru",
  exhausted: "Batas percobaan habis. Silakan kirim ulang kode baru",
  rateLimited: "Terlalu sering meminta kode. Tunggu 1 menit sebelum mencoba lagi.",
  verifyFailed: "Gagal memverifikasi kode, coba lagi beberapa saat.",
  resendFailed: "Gagal mengirim ulang kode, coba lagi beberapa saat.",
} as const;

function getFeedback(
  status: VerifyOtpStatus,
  validationMessage?: string,
): VerifyOtpFeedback | null {
  if (validationMessage) return { tone: "error", message: validationMessage };

  switch (status.type) {
    case "verified":
      return { tone: "success", message: MESSAGES.verified };
    case "invalid":
      return { tone: "error", message: MESSAGES.invalid };
    case "expired":
      return { tone: "error", message: MESSAGES.expired };
    case "exhausted":
      return { tone: "error", message: MESSAGES.exhausted };
    case "rate_limited":
      return { tone: "error", message: MESSAGES.rateLimited };
    case "failed":
      return { tone: "error", message: status.message };
    default:
      return null;
  }
}

interface UseVerifyOtpOptions {
  /** Dipanggil setelah kode terverifikasi; pemakai menentukan langkah berikutnya. */
  onVerified?: () => void;
}

export function useVerifyOtp(
  email: string,
  { onVerified }: UseVerifyOtpOptions = {},
) {
  const [status, setStatus] = useState<VerifyOtpStatus>({ type: "idle" });
  const [attemptsLeft, setAttemptsLeft] = useState(OTP_MAX_ATTEMPTS);
  const [secondsLeft, setSecondsLeft] = useState(OTP_COOLDOWN_SECONDS);
  const [isResending, setIsResending] = useState(false);

  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { code: "" },
    // Error "belum lengkap" muncul saat submit dan hilang begitu digit diubah
    // (sama seperti error dari server), bukan menyala-mati saat mengetik.
    reValidateMode: "onSubmit",
  });

  // Hitung mundur sebelum "Kirim ulang" aktif.
  useEffect(() => {
    if (secondsLeft <= 0) return undefined;

    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const onSubmit = form.handleSubmit(async ({ code }) => {
    setStatus({ type: "idle" });

    try {
      await verifyPasswordResetOtp(email, code);
      setStatus({ type: "verified" });
      onVerified?.();
    } catch (error) {
      if (error instanceof OtpExpiredError) {
        // Kedaluwarsa tidak mengurangi percobaan; kirim ulang langsung tersedia.
        setStatus({ type: "expired" });
        setSecondsLeft(0);
        return;
      }

      if (error instanceof OtpInvalidError) {
        const remaining = attemptsLeft - 1;
        setAttemptsLeft(remaining);

        if (remaining <= 0) {
          form.setValue("code", "");
          setStatus({ type: "exhausted" });
          setSecondsLeft(0);
        } else {
          setStatus({ type: "invalid" });
        }
        return;
      }

      setStatus({
        type: "failed",
        message: getServerMessage(error, MESSAGES.verifyFailed),
      });
    }
  });

  // Mengubah digit menghapus pesan error (validasi maupun dari server).
  const onCodeEdited = () => {
    form.clearErrors("code");
    setStatus((current) =>
      current.type === "verified" || current.type === "exhausted"
        ? current
        : { type: "idle" },
    );
  };

  const resend = async () => {
    setIsResending(true);
    try {
      await requestPasswordResetOtp(email, { isResend: true });
      form.reset({ code: "" });
      setAttemptsLeft(OTP_MAX_ATTEMPTS);
      setStatus({ type: "idle" });
      setSecondsLeft(OTP_COOLDOWN_SECONDS);
    } catch (error) {
      if (error instanceof OtpRateLimitError) {
        setStatus({ type: "rate_limited" });
        setSecondsLeft(error.retryAfterSeconds);
      } else {
        setStatus({
          type: "failed",
          message: getServerMessage(error, MESSAGES.resendFailed),
        });
      }
    } finally {
      setIsResending(false);
    }
  };

  const validationMessage = form.formState.errors.code?.message;
  const isSubmitting = form.formState.isSubmitting;
  const isVerified = status.type === "verified";
  const isExhausted = status.type === "exhausted";
  const isExpired = status.type === "expired";

  return {
    form,
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
    feedback: getFeedback(status, validationMessage),
    // Kotak merah: belum lengkap, kode salah, atau kedaluwarsa.
    isCodeInvalid:
      Boolean(validationMessage) ||
      status.type === "invalid" ||
      status.type === "expired",
    // Digit abu-abu: error dari server atau sukses (sesuai Figma).
    isCodeMuted:
      status.type === "invalid" ||
      status.type === "expired" ||
      status.type === "verified",
    // Kotak tidak bisa diisi saat memproses, sukses, atau percobaan habis.
    isCodeLocked: isSubmitting || isResending || isVerified || isExhausted,
  };
}
