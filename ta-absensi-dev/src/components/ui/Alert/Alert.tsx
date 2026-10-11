import type { ReactNode } from "react";

export interface AlertProps {
  variant?: "danger" | "warning";
  icon?: ReactNode;
  children: ReactNode;
}

const VARIANT_CLASS = {
  danger: "alert-danger",
  warning: "alert-warning",
} as const;

export function Alert({ variant = "danger", icon, children }: AlertProps) {
  return (
    <div
      className={`alert ${VARIANT_CLASS[variant]} py-2 small d-flex align-items-center gap-2`}
      role="alert"
    >
      {icon && <span className="d-flex flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
