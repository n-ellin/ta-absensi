import type { ReactNode } from "react";

interface AuthCenteredLayoutProps {
  /** Konten di atas kartu, mis. Stepper. */
  header?: ReactNode;
  /** Konten di bawah kartu (di luar kartu). */
  footer?: ReactNode;
  children: ReactNode;
}

// Beda dengan AuthLayout (split-panel untuk Login/Register): desain alur lupa
// kata sandi di Figma tidak memakai panel branding, jadi dibuat layout terpisah.
export function AuthCenteredLayout({
  header,
  footer,
  children,
}: AuthCenteredLayoutProps) {
  return (
    <main className="auth-centered bg-white d-flex flex-column align-items-center justify-content-center px-2 px-sm-3 py-4 py-md-5">
      {header && <div className="auth-centered__header">{header}</div>}

      <div className="auth-centered__card">{children}</div>

      {footer && <div className="mt-3 w-100 text-center">{footer}</div>}
    </main>
  );
}
