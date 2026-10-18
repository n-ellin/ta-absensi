import { Suspense, type ReactElement } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import lazyWithRetry from "./lazyWithRetry";
import ProtectedRoute from "./ProtectedRoute";
import PageLoader from "@/components/ui/PageLoader";

const ErrorPage = lazyWithRetry(() =>
  import("@/features/errors/pages/ErrorPage").then((m) => ({
    default: m.ErrorPage,
  })),
);
const RegisterPage = lazyWithRetry(
  () => import("@/features/auth/pages/RegisterPage"),
);
const LoginPage = lazyWithRetry(
  () => import("@/features/auth/pages/LoginPage"),
);
const ForgotPasswordPage = lazyWithRetry(
  () => import("@/features/auth/pages/ForgotPasswordPage"),
);
const VerifyOtpPage = lazyWithRetry(
  () => import("@/features/auth/pages/VerifyOtpPage"),
);
const ResetPasswordPage = lazyWithRetry(
  () => import("@/features/auth/pages/ResetPasswordPage"),
);

// Ganti Kata Sandi hanya untuk pengguna yang sudah login. Namun LoginForm
// belum mengisi authStore (TODO setAuth di useLogin), sehingga ProtectedRoute
// akan selalu mengarahkan ke /login. Karena itu guard hanya dilewati saat
// development agar route bisa diuji; build production memakai guard penuh.
const RequireAuth = () =>
  import.meta.env.DEV ? <Outlet /> : <ProtectedRoute />;

const withSuspense = (element: ReactElement) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

const router = createBrowserRouter([
  {
    // Menangkap error runtime/loader di semua child route sebagai 500
    errorElement: withSuspense(<ErrorPage code="500" />),
    children: [
      {
        path: "/login",
        element: withSuspense(<LoginPage />),
      },
      {
        path: "/register",
        element: withSuspense(<RegisterPage />),
      },
      {
        path: "/forgot-password",
        element: withSuspense(<ForgotPasswordPage />),
      },
      {
        path: "/forgot-password/verify",
        element: withSuspense(<VerifyOtpPage />),
      },
      {
        path: "/forgot-password/new-password",
        element: withSuspense(<ResetPasswordPage />),
      },
      {
        // Ganti Kata Sandi: halaman yang sama dengan Lupa Kata Sandi, hanya
        // beda pintu masuk (flow="change"). Nantinya tombol di Pengaturan Akun
        // cukup diarahkan ke /change-password.
        element: <RequireAuth />,
        children: [
          {
            path: "/change-password",
            element: withSuspense(<ForgotPasswordPage flow="change" />),
          },
          {
            path: "/change-password/verify",
            element: withSuspense(<VerifyOtpPage flow="change" />),
          },
          {
            path: "/change-password/new-password",
            element: withSuspense(<ResetPasswordPage flow="change" />),
          },
        ],
      },
      // Taruh route aplikasi lain di sini, di atas catch-all
      {
        path: "/error/:code",
        element: withSuspense(<ErrorPage />),
      },
      {
        path: "*",
        element: withSuspense(<ErrorPage code="404" />),
      },
    ],
  },
]);

export default router;
