import {
  forwardRef,
  useId,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { ErrorText } from "../ErrorText";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, icon, error, options, placeholder, id, className = "", ...props },
    ref,
  ) => {
    const autoId = useId();
    const selectId = id ?? autoId;

    const classes = [
      "form-select",
      icon ? "border-start-0" : "",
      error ? "is-invalid" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="mb-3">
        {label && (
          <label
            htmlFor={selectId}
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

          <select
            ref={ref}
            id={selectId}
            className={classes}
            defaultValue=""
            aria-invalid={!!error}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <ErrorText message={error} />
      </div>
    );
  },
);

Select.displayName = "Select";
