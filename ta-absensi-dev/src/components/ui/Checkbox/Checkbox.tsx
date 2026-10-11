import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { ErrorText } from "../ErrorText";

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: ReactNode;
  error?: string;
  wrapperClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, error, id, className = "", wrapperClassName = "mb-3", ...props },
    ref,
  ) => {
    const autoId = useId();
    const checkId = id ?? autoId;

    return (
      <div className={wrapperClassName}>
        <div className="form-check">
          <input
            ref={ref}
            id={checkId}
            type="checkbox"
            className={`form-check-input ${error ? "is-invalid" : ""} ${className}`}
            {...props}
          />
          <label htmlFor={checkId} className="form-check-label small">
            {label}
          </label>
        </div>

        <ErrorText message={error} />
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
