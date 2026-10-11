import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  registerSchema,
  type RegisterFormValues,
} from "../schemas/registerSchema";
import { register } from "../services/authService";
import { getServerMessage } from "../utils/authError";

export function useRegister() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      identityNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);

    try {
      // confirmPassword hanya untuk validasi FE, tidak dikirim ke BE.
      await register({
        name: values.name,
        email: values.email,
        identityNumber: values.identityNumber,
        password: values.password,
      });
      navigate("/login", { replace: true });
    } catch (error) {
      setServerError(
        getServerMessage(error, "Pendaftaran gagal, coba lagi beberapa saat."),
      );
    }
  });

  const handleGoogleRegister = () => {
    // TODO: sambungkan ke flow OAuth Google setelah endpoint dari Backend siap
  };

  return {
    form,
    onSubmit,
    serverError,
    isSubmitting: form.formState.isSubmitting,
    handleGoogleRegister,
  };
}
