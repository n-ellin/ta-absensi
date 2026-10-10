import { Check } from "lucide-react";
import {
  PASSWORD_RULES,
  getPasswordStrength,
  type PasswordStrengthLevel,
} from "../schemas/passwordRules";

const LEVEL_META: Record<
  PasswordStrengthLevel,
  { label: string; textClass: string; barClass: string }
> = {
  weak: { label: "Lemah", textClass: "text-danger", barClass: "bg-danger" },
  medium: {
    label: "Sedang",
    textClass: "text-warning",
    barClass: "bg-warning",
  },
  strong: { label: "Kuat", textClass: "text-success", barClass: "bg-success" },
};

const TRANSITION = { transition: "all 0.25s ease" } as const;

interface PasswordStrengthProps {
  value: string;
}

export function PasswordStrength({ value }: PasswordStrengthProps) {
  const { passed, total, level } = getPasswordStrength(value);
  const meta = LEVEL_META[level];
  const hasValue = value.length > 0;

  return (
    <div className="mb-3" aria-live="polite">
      <div className="d-flex justify-content-between small mb-1">
        <span className="text-secondary">Kekuatan kata sandi</span>
        {hasValue && (
          <span className={`fw-semibold ${meta.textClass}`}>{meta.label}</span>
        )}
      </div>

      <div className="d-flex gap-1 mb-2">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`flex-fill rounded-pill ${
              hasValue && i < passed ? meta.barClass : "bg-secondary-subtle"
            }`}
            style={{ height: 4, ...TRANSITION }}
          />
        ))}
      </div>

      <ul className="list-unstyled mb-0 small d-flex flex-column gap-1">
        {PASSWORD_RULES.map((rule) => {
          const ok = rule.test(value);
          return (
            <li
              key={rule.id}
              className={`d-flex align-items-center gap-2 ${
                ok ? "text-success" : "text-secondary"
              }`}
              style={TRANSITION}
            >
              <span
                className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 14, height: 14 }}
              >
                {ok ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  <span
                    className="rounded-circle bg-secondary-subtle d-block"
                    style={{ width: 5, height: 5 }}
                  />
                )}
              </span>
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
