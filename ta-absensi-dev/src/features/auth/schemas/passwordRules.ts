export interface PasswordRule {
  id: "length" | "case" | "number";
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

export type PasswordStrengthLevel = "weak" | "medium" | "strong";

export function getPasswordStrength(value: string) {
  const passed = PASSWORD_RULES.filter((rule) => rule.test(value)).length;
  const level: PasswordStrengthLevel =
    passed >= 3 ? "strong" : passed === 2 ? "medium" : "weak";

  return { passed, total: PASSWORD_RULES.length, level };
}
