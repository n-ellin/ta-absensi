import { z } from "zod";
import { PASSWORD_RULES } from "./passwordRules";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Nama lengkap wajib diisi")
      .min(3, "Nama lengkap minimal 3 karakter"),
    email: z
      .string()
      .trim()
      .min(1, "Surel wajib diisi")
      .email("Format surel tidak valid"),
    identityNumber: z
      .string()
      .trim()
      .min(1, "NISN wajib diisi")
      .regex(/^\d+$/, "NISN hanya boleh berisi angka")
      .length(10, "NISN harus 10 digit"),
    password: z
      .string()
      .min(1, "Kata sandi wajib diisi")
      .refine(
        (value) => PASSWORD_RULES.every((rule) => rule.test(value)),
        "Kata sandi belum memenuhi semua ketentuan",
      ),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi kata sandi tidak cocok",
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
