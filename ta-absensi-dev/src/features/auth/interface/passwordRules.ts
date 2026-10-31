// Kontrak aturan kekuatan kata sandi: dipakai schema (validasi) dan UI.

export interface PasswordRule {
  id: "length" | "case" | "number" | "symbol";
  label: string;
  test: (value: string) => boolean;
}

export type PasswordStrengthLevel = "weak" | "medium" | "strong";
