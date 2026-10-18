import type { ReactNode } from "react";

interface AuthFormHeaderProps {
  icon: ReactNode;
  title: string;
  /** Kelas tambahan untuk lingkaran ikon, mis. varian sukses. */
  iconClassName?: string;
  /** Deskripsi singkat di bawah judul. */
  children: ReactNode;
}

// Header kartu alur lupa kata sandi: lingkaran ikon, judul, deskripsi.
export function AuthFormHeader({
  icon,
  title,
  iconClassName = "",
  children,
}: AuthFormHeaderProps) {
  return (
    <>
      <div className={`auth-form__icon ${iconClassName}`.trim()} aria-hidden="true">
        {icon}
      </div>
      <h1 className="h4 fw-bold text-center mb-2">{title}</h1>
      <p className="text-secondary small text-center mb-4">{children}</p>
    </>
  );
}
