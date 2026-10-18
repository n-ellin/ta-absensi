export interface PasswordRule {
  id: "length" | "case" | "number" | "symbol";
  label: string;
  test: (value: string) => boolean;
}

// Satu sumber aturan: dipakai oleh schema (validasi) dan PasswordStrength (UI).
export const PASSWORD_RULES: readonly PasswordRule[] = [
  {
    id: "length",
    label: "Minimal 8 karakter",
    test: (v) => v.length >= 8,
  },
  {
    id: "case",
    label: "Mengandung huruf kapital dan huruf kecil",
    test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v),
  },
  {
    id: "number",
    label: "Mengandung minimal 1 angka",
    test: (v) => /\d/.test(v),
  },
];

// PRD Reset Password: aturan dasar + wajib mengandung simbol.
// Register tetap memakai PASSWORD_RULES (3 aturan) agar perilakunya tidak berubah.
export const RESET_PASSWORD_RULES: readonly PasswordRule[] = [
  ...PASSWORD_RULES,
  {
    id: "symbol",
    label: "Mengandung minimal 1 simbol",
    test: (v) => /[^A-Za-z0-9\s]/.test(v),
  },
];

export type PasswordStrengthLevel = "weak" | "medium" | "strong";

export function getPasswordStrength(
  value: string,
  rules: readonly PasswordRule[] = PASSWORD_RULES,
) {
  const total = rules.length;
  const passed = rules.filter((rule) => rule.test(value)).length;
  // Untuk 3 aturan hasilnya sama dengan sebelumnya: 3 kuat, 2 sedang, selain itu lemah.
  const level: PasswordStrengthLevel =
    passed === total
      ? "strong"
      : passed >= Math.ceil(total / 2)
        ? "medium"
        : "weak";

  return { passed, total, level };
}
