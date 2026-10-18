import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Key,
  Mail,
  MailCheck,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { PASSWORD_FLOWS, type PasswordFlow } from "../config/passwordFlow";
import { AuthFormHeader } from "./AuthFormHeader";
import { SecurityNote } from "./SecurityNote";

interface ForgotPasswordFormProps {
  /** Alur pemakai; menentukan rute, teks, dan apakah surel bisa diketik. */
  flow?: PasswordFlow;
  /** Surel akun yang login. Wajib untuk alur "change" (surel dikunci). */
  accountEmail?: string;
}

// Langkah 1 universal: dipakai Lupa Kata Sandi (surel diketik) dan Ganti Kata
// Sandi (surel akun yang login, dikunci).
export function ForgotPasswordForm({
  flow = "forgot",
  accountEmail,
}: ForgotPasswordFormProps) {
  const navigate = useNavigate();
  const config = PASSWORD_FLOWS[flow];
  const isEmailLocked = config.usesAccountEmail;
  const {
    form: {
      register,
      formState: { errors },
    },
    onSubmit,
    status,
    isSubmitting,
    isCooldown,
  } = useForgotPassword({
    verifyPath: config.paths.verify,
    defaultEmail: accountEmail,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="auth-form">
      <AuthFormHeader
        icon={
          isEmailLocked ? (
            <ShieldCheck size={26} />
          ) : (
            // Ikon kunci horizontal seperti Figma: lucide Key diputar 45°
            <Key size={26} style={{ transform: "rotate(45deg)" }} />
          )
        }
        title={config.start.title}
      >
        {config.start.description}
      </AuthFormHeader>

      {status.type === "sent" && (
        <Alert variant="success" icon={<MailCheck size={16} />}>
          {config.start.sentMessage}
        </Alert>
      )}

      <Input
        label="Surel"
        type="email"
        icon={<Mail size={16} />}
        placeholder={isEmailLocked ? undefined : "Masukkan surel"}
        autoComplete="email"
        spellCheck={false}
        // PRD: form terkunci saat submit. Pada Ganti Kata Sandi selalu dikunci.
        readOnly={isEmailLocked || isSubmitting}
        className={isEmailLocked ? "auth-form__input--locked" : undefined}
        error={errors.email?.message}
        {...register("email")}
      />

      {status.type === "rate_limited" && (
        <Alert
          variant="warning"
          icon={
            <TriangleAlert
              size={16}
              fill="currentColor"
              stroke="var(--color-warning-bg)"
            />
          }
        >
          Terlalu sering meminta kode. Tunggu 1 menit sebelum mencoba lagi.
        </Alert>
      )}

      {status.type === "failed" && (
        <Alert variant="danger" icon={<TriangleAlert size={16} />}>
          {status.message}
        </Alert>
      )}

      <Button
        type="submit"
        className={`auth-form__btn ${isCooldown ? "is-cooldown" : ""}`}
        isLoading={isSubmitting}
        disabled={isCooldown}
      >
        {isSubmitting ? (
          "Memproses..."
        ) : (
          <>
            Kirim Kode OTP
            <ArrowRight size={16} />
          </>
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="auth-form__btn mt-2"
        onClick={() => navigate(config.exitPath)}
      >
        <ArrowLeft size={16} />
        {config.start.backLabel}
      </Button>

      <SecurityNote />
    </form>
  );
}
