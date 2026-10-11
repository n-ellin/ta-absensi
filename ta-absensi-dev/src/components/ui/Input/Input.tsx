import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { ErrorText } from "../ErrorText";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, rightElement, error, id, className = "", ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    const classes = [
      "form-control",
      icon ? "border-start-0" : "",
      rightElement ? "border-end-0" : "",
      error ? "is-invalid" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="mb-3">
        {label && (
          <label
            htmlFor={inputId}
            className="form-label small fw-semibold mb-1"
          >
            {label}
          </label>
        )}

        <div className="input-group">
          {icon && (
            <span className="input-group-text bg-white text-secondary border-end-0">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={classes}
            aria-invalid={!!error}
            {...props}
          />

          {rightElement && (
            <span className="input-group-text bg-white border-start-0 p-0">
              {rightElement}
            </span>
          )}
        </div>

        <ErrorText message={error} />
      </div>
    );
  },
);

Input.displayName = "Input";
