import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  registerSchema,
  type RegisterFormValues,
} from "../schemas/registerSchema";
import { AuthServices } from "../services/authService";
import { getServerMessage } from "../utils/authError";
import { useAuth } from "./useAuth";
import { useGoogleAuth } from "./useGoogleAuth";

export function useRegister() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      nisn: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);

    try {
      // confirmPassword hanya untuk validasi FE, tidak dikirim ke BE.
await AuthServices.register({
  name: values.name,
  email: values.email,
  nisn: values.nisn,
  password: values.password,
});
      navigate("/login", { replace: true });
    } catch (error) {
      setServerError(
        getServerMessage(error, "Pendaftaran gagal, coba lagi beberapa saat."),
      );
    }
  });

  const handleGoogleCredential = useCallback(
    async (idToken: string) => {
      setServerError(null);
      try {
const res = await AuthServices.googleLogin({
  id_token: idToken,
  device_info: "web",
});
        if (res.success && res.data) {
          setAuth(res.data.user, res.data.access_token, res.data.refresh_token);
          navigate("/", { replace: true });
        }
      } catch (error) {
        setServerError(
          getServerMessage(error, "Masuk dengan Google gagal, coba lagi."),
        );
      }
    },
    [setAuth, navigate],
  );

  const handleGoogleError = useCallback(() => {
    setServerError(
      "Daftar dengan Google sedang tidak tersedia. Silakan daftar dengan surel dan kata sandi.",
    );
  }, []);

  const { googleEnabled, googleFailed, googleContainerRef } = useGoogleAuth(
    handleGoogleCredential,
    handleGoogleError,
  );

  return {
    form,
    onSubmit,
    serverError,
    isSubmitting: form.formState.isSubmitting,
    googleEnabled,
    googleFailed,
    handleGoogleUnavailable: handleGoogleError,
    googleContainerRef,
  };
}
