import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormValues } from "../schemas/LoginSchema";
import { login } from "../services/authService";
import { getLoginErrorType, getServerMessage } from "../utils/authError";

export type LoginAlert = { variant: "danger" | "warning"; message: string };

export function useLogin() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState<LoginAlert | null>(null);
  const [isDisabledModalOpen, setDisabledModalOpen] = useState(false);

const form = useForm<LoginFormValues>({
  resolver: zodResolver(loginSchema),
  defaultValues: { email: "", password: "" },
});


  const onSubmit = form.handleSubmit(async (values) => {
    setAlert(null);

    try {
      await login(values);

      // TODO: simpan token/user ke authStore (setAuth) setelah response BE jelas,
      // lalu arahkan sesuai role (siswa/guru/admin). Sementara ke "/".
      navigate("/", { replace: true });
    } catch (error) {
      switch (getLoginErrorType(error)) {
        case "invalid_credentials":
          setAlert({
            variant: "danger",
            message: "Surel atau kata sandi tidak sesuai",
          });
          break;
        case "locked":
          setAlert({
            variant: "warning",
            message:
              "Terlalu banyak percobaan gagal. Akun dikunci sementara selama 15 menit",
          });
          break;
        case "disabled":
          setDisabledModalOpen(true);
          break;
        default:
          setAlert({
            variant: "danger",
            message: getServerMessage(
              error,
              "Login gagal, coba lagi beberapa saat.",
            ),
          });
      }
    }
  });

  const handleGoogleLogin = () => {
    // TODO: sambungkan ke flow OAuth Google setelah endpoint dari Backend siap
  };

  return {
    form,
    onSubmit,
    alert,
    isSubmitting: form.formState.isSubmitting,
    isDisabledModalOpen,
    closeDisabledModal: () => setDisabledModalOpen(false),
    handleGoogleLogin,
  };
}
