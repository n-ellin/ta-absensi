import { useState } from "react";
import { useWatch } from "react-hook-form";
import { Lock, TriangleAlert } from "lucide-react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useResetPassword } from "../hooks/useResetPassword";
import { RESET_PASSWORD_RULES } from "../schemas/passwordRules";
import { AuthFormHeader } from "./AuthFormHeader";
import { PasswordStrength } from "./PasswordStrength";

const RULES_ID = "reset-password-rules";

interface ResetPasswordFormProps {
  email: string;
  onSuccess: () => void;
}

export function ResetPasswordForm({ email, onSuccess }: ResetPasswordFormProps) {
  const [showStrength, setShowStrength] = useState(false);
  const {
    form: {
      register,
      control,
      formState: { errors },
    },
    onSubmit,
    serverError,
    isSubmitting,
  } = useResetPassword(email, { onSuccess });

  const password = useWatch({ control, name: "password" }) ?? "";

  return (
    <form onSubmit={onSubmit} noValidate className="auth-form">
      <AuthFormHeader icon={<Lock size={26} />} title="Buat Kata Sandi Baru">
        Buat kata sandi baru yang kuat untuk akun Anda.
      </AuthFormHeader>

      {serverError && (
        <Alert variant="danger" icon={<TriangleAlert size={16} />}>
          {serverError}
        </Alert>
      )}

      <PasswordInput
        label="Kata Sandi Baru"
        icon={<Lock size={16} />}
        placeholder="Masukkan kata sandi baru"
        autoComplete="new-password"
        readOnly={isSubmitting}
        error={errors.password?.message}
        aria-describedby={showStrength ? RULES_ID : undefined}
        {...register("password", {
          deps: ["confirmPassword"],
          onChange: () => setShowStrength(true),
        })}
        onFocus={() => setShowStrength(true)}
      />

      {showStrength && (
        <PasswordStrength
          id={RULES_ID}
          value={password}
          rules={RESET_PASSWORD_RULES}
        />
      )}

      <PasswordInput
        label="Konfirmasi Kata Sandi Baru"
        icon={<Lock size={16} />}
        placeholder="Ulangi kata sandi baru"
        autoComplete="new-password"
        readOnly={isSubmitting}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      {/* Label mengikuti Figma. PRD menyebut "Simpan & Masuk", tetapi alurnya
          berakhir di Login (bukan masuk otomatis), jadi label itu menyesatkan. */}
      <Button type="submit" className="auth-form__btn" isLoading={isSubmitting}>
        {isSubmitting ? "Memproses..." : "Simpan Kata Sandi Baru"}
      </Button>
    </form>
  );
}
