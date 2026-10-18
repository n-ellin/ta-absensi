import { z } from "zod";
import { RESET_PASSWORD_RULES } from "./passwordRules";

export const PASSWORD_MIN_LENGTH = 8;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Kata sandi baru wajib diisi")
      .min(
        PASSWORD_MIN_LENGTH,
        `Kata sandi baru minimal ${PASSWORD_MIN_LENGTH} karakter`,
      )
      .refine(
        (value) => RESET_PASSWORD_RULES.every((rule) => rule.test(value)),
        "Kata sandi belum memenuhi kriteria keamanan",
      ),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi kata sandi tidak sesuai",
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
