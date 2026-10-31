import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormValues } from "../schemas/LoginSchema";
import { AuthServices } from "../services/authService";
import {
  getErrorCode,
  getLoginErrorType,
  getServerMessage,
} from "../utils/authError";
import { useAuth } from "./useAuth";
import { useGoogleAuth } from "./useGoogleAuth";
import type { AuthData } from "../interface/auth";
import type { LoginAlert } from "../interface/hooks";
import { getDeviceInfo } from "../utils/deviceInfo";

export function useLogin() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [alert, setAlert] = useState<LoginAlert | null>(null);
  const [isDisabledModalOpen, setDisabledModalOpen] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

const finishLogin = useCallback(
  (data: AuthData) => {
    setAuth(data.user, data.access_token, data.refresh_token, data.expires_in);
    navigate("/", { replace: true });
  },
  [setAuth, navigate],
);

  const onSubmit = form.handleSubmit(async (values) => {
    setAlert(null);

    try {
const res = await AuthServices.login({
  identifier: values.email,
  password: values.password,
  device_info: getDeviceInfo(),
});
      if (res.success && res.data) {
        finishLogin(res.data);
      }
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
        case "rate_limited":
          setAlert({
            variant: "warning",
            message:
              "Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.",
          });
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

  const handleGoogleCredential = useCallback(
    async (idToken: string) => {
      setAlert(null);
      try {
const res = await AuthServices.googleLogin({
  id_token: idToken,
  device_info: getDeviceInfo(),
});
        if (res.success && res.data) {
          finishLogin(res.data);
        }
      } catch (error) {
        const code = getErrorCode(error);
        if (code === "AUTH_ACCOUNT_NOT_FOUND") {
          setAlert({
            variant: "danger",
            message:
              "Email Google belum terdaftar. Silakan daftar terlebih dahulu.",
          });
        } else if (code === "AUTH_GOOGLE_DISABLED") {
          setAlert({
            variant: "warning",
            message: "Login Google belum diaktifkan di server.",
          });
        } else if (code === "AUTH_GOOGLE_EMAIL_UNVERIFIED") {
          setAlert({
            variant: "danger",
            message: "Email Google Anda belum terverifikasi.",
          });
        } else {
          setAlert({
            variant: "danger",
            message: getServerMessage(
              error,
              "Login Google gagal, coba lagi beberapa saat.",
            ),
          });
        }
      }
    },
    [finishLogin],
  );

  const handleGoogleError = useCallback(() => {
    setAlert({
      variant: "warning",
      message:
        "Login dengan Google sedang tidak tersedia. Silakan masuk dengan surel dan kata sandi.",
    });
  }, []);

  const { googleEnabled, googleFailed, googleContainerRef } = useGoogleAuth(
    handleGoogleCredential,
    handleGoogleError,
  );

  return {
    form,
    onSubmit,
    alert,
    isSubmitting: form.formState.isSubmitting,
    isDisabledModalOpen,
    closeDisabledModal: () => setDisabledModalOpen(false),
    googleEnabled,
    googleFailed,
    handleGoogleUnavailable: handleGoogleError,
    googleContainerRef,
  };
}
