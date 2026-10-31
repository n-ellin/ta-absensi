import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./core/routes";
import PageLoader from "@/components/ui/PageLoader";
import { useSessionBootstrap } from "@/features/auth/hooks/useSessionBootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";

function App() {
  const status = useSessionBootstrap();

  // Tahan render sampai sesi tersimpan tervalidasi (atau dibersihkan)
  if (status === "checking") return <PageLoader />;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
