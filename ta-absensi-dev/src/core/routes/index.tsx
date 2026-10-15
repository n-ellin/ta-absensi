import { Suspense, type ReactElement } from "react";
import { createBrowserRouter } from "react-router-dom";
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
const DashboardPage = lazyWithRetry(
  () => import("@/features/dashboard/pages/DashboardPage"),
);

const withSuspense = (element: ReactElement) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

const router = createBrowserRouter([
  {
    // Menangkap error runtime/loader di semua child route sebagai 500
    errorElement: withSuspense(<ErrorPage code="500" />),
    children: [
      // Halaman yang butuh login
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          { index: true, element: withSuspense(<DashboardPage />) },
        ],
      },
      // Halaman auth tanpa login
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
