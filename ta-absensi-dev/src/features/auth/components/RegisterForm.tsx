import { Link } from "react-router-dom";
import { useWatch } from "react-hook-form";
import { Contact, KeyRound, Mail, User } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert/Alert";
import { Divider } from "@/components/ui/Divider";
import { useRegister } from "../hooks/useRegister";
import { GoogleButton } from "./GoogleButton";
import { PasswordStrength } from "../components/PasswordStrength";

export function RegisterForm() {
   const {
     form: {
       register,
       control,
       formState: { errors },
     },
     onSubmit,
     serverError,
     isSubmitting,
     handleGoogleRegister,
   } = useRegister();

   const password = useWatch({ control, name: "password" }) ?? "";
console.log("[debug] password =", password);
  return (
    <form onSubmit={onSubmit} noValidate>
      <h1 className="h4 fw-bold mb-1">Buat Akun Baru</h1>
      <p className="text-secondary small mb-4">
        Isi data berikut untuk mendaftar akun E-Absensi
      </p>

      {serverError && <Alert variant="danger">{serverError}</Alert>}

      <Input
        label="Nama Lengkap"
        icon={<User size={16} />}
        placeholder="Masukkan nama lengkap"
        autoComplete="name"
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        label="Surel"
        type="email"
        icon={<Mail size={16} />}
        placeholder="Masukkan surel"
        autoComplete="email"
        spellCheck={false}
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="NISN"
        icon={<Contact size={16} />}
        placeholder="Masukkan nomor induk siswa nasional"
        inputMode="numeric"
        maxLength={10}
        error={errors.identityNumber?.message}
        {...register("identityNumber")}
      />

      <PasswordInput
        label="Kata Sandi"
        icon={<KeyRound size={16} />}
        placeholder="Masukkan kata sandi"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password", { deps: ["confirmPassword"] })}
      />

      {password.length > 0 && <PasswordStrength value={password} />}

      <PasswordInput
        label="Konfirmasi kata sandi"
        icon={<KeyRound size={16} />}
        placeholder="Konfirmasi kata sandi"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button type="submit" isLoading={isSubmitting}>
        Daftar Sekarang
      </Button>

      <Divider text="ATAU" />

      <GoogleButton onClick={handleGoogleRegister}>
        Daftar dengan Google
      </GoogleButton>

      <p className="text-center small text-secondary mt-3 mb-0">
        Sudah punya akun?{" "}
        <Link
          to="/login"
          className="fw-semibold text-dark text-decoration-none"
        >
          Masuk
        </Link>
      </p>
    </form>
  );
}
