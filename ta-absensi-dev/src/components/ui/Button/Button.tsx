import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  isLoading?: boolean;
}

const VARIANT_CLASS = {
  primary: "btn-dark",
  outline: "btn-outline-secondary",
} as const;

export function Button({
  variant = "primary",
  isLoading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 ${VARIANT_CLASS[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="spinner-border spinner-border-sm" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
