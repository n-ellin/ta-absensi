import { Suspense, type ReactElement } from "react";
import { createBrowserRouter } from "react-router-dom";
import lazyWithRetry from "./lazyWithRetry";
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
