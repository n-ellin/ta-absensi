import { Link } from "react-router-dom";
import { Ban, Lock, Mail, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Modal } from "@/components/ui/Modal/Modal";
import { Divider } from "@/components/ui/Divider";
import { useLogin } from "../hooks/useLogin";
import { GoogleButton } from "./GoogleButton";

export function LoginForm() {
  const {
    form: {
      register,
      formState: { errors },
    },
    onSubmit,
    alert,
    isSubmitting,
    isDisabledModalOpen,
    closeDisabledModal,
    handleGoogleLogin,
  } = useLogin();

  return (
    <>
      <form onSubmit={onSubmit} noValidate>
        <h1 className="h4 fw-bold mb-1">Selamat Datang</h1>
        <p className="text-secondary small mb-4">
          Masuk ke akun Anda untuk melanjutkan
        </p>

        {alert && (
          <Alert
            variant={alert.variant}
            icon={
              alert.variant === "warning" ? (
                <Lock size={16} />
              ) : (
                <TriangleAlert size={16} />
              )
            }
          >
            {alert.message}
          </Alert>
        )}

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

        <PasswordInput
          label="Kata Sandi"
          icon={<Lock size={16} />}
          placeholder="Masukkan kata sandi"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="d-flex justify-content-end mb-3">
          <Link
            to="/forgot-password"
            className="small fw-semibold text-dark text-decoration-none"
          >
            Lupa Kata Sandi?
          </Link>
        </div>

        <Button type="submit" isLoading={isSubmitting} >
          Masuk
        </Button>

        <Divider text="ATAU" />

        <GoogleButton onClick={handleGoogleLogin}>
          Masuk dengan Google
        </GoogleButton>

        <p className="text-center small text-secondary mt-3 mb-0">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="fw-semibold text-dark text-decoration-none"
          >
            Daftar sebagai siswa
          </Link>
        </p>
      </form>

      <Modal
        open={isDisabledModalOpen}
        onClose={closeDisabledModal}
        icon={<Ban size={28} className="text-danger" />}
        title="Akses Ditolak"
        description="Akun Anda telah dinonaktifkan. Silakan hubungi admin Sekolah"
      >
        <Button
          type="button"
          variant="outline"
          className="btn-sm"
          onClick={closeDisabledModal}
        >
          Tutup
        </Button>
        {/* Aksi "Hubungi Admin" sengaja belum dipasang (menunggu keputusan tujuan). */}
        <Button type="button" className="btn-sm">
          Hubungi Admin
        </Button>
      </Modal>
    </>
  );
}
