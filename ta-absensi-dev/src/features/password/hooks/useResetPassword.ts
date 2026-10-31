import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/resetPasswordSchema";
import {
  PasswordReusedError,
  resetPassword,
} from "../services/resetPasswordService";
import { getServerMessage } from "@/features/auth/utils/authError";
import type { UseResetPasswordOptions } from "../interface";

const FAILED_FALLBACK_MESSAGE =
  "Gagal menyimpan kata sandi baru, coba lagi beberapa saat.";

export function useResetPassword(
  email: string,
  { onSuccess }: UseResetPasswordOptions,
) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = form.handleSubmit(async ({ password }) => {
    setServerError(null);

    try {
      await resetPassword(email, password);
      onSuccess();
    } catch (error) {
      if (error instanceof PasswordReusedError) {
        // Sesuai Figma: pesan tampil di bawah input kata sandi baru.
        form.setError("password", { type: "server", message: error.message });
        form.setFocus("password");
        return;
      }
      setServerError(getServerMessage(error, FAILED_FALLBACK_MESSAGE));
    }
  });

  return {
    form,
    onSubmit,
    serverError,
    isSubmitting: form.formState.isSubmitting,
  };
}
