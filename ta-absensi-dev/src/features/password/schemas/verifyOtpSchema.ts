import { z } from "zod";

export const OTP_LENGTH = 6;

export const verifyOtpSchema = z.object({
  code: z
    .string()
    .regex(
      new RegExp(`^\\d{${OTP_LENGTH}}$`),
      `Masukkan ${OTP_LENGTH} digit kode OTP secara lengkap`,
    ),
});

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;
