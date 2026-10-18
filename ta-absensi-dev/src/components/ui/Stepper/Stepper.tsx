import { Check } from "lucide-react";

export interface StepperProps {
  steps: string[];
  /** Indeks langkah aktif (mulai dari 0). Langkah sebelumnya ditampilkan selesai (centang). */
  currentStep: number;
}

const CIRCLE_SIZE = 28;
const STEP_WIDTH = 64;

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <ol
      className="list-unstyled d-flex w-100 mx-auto mb-0 p-0"
      style={{ maxWidth: "34rem" }}
      aria-label="Langkah"
    >
      {steps.map((label, index) => {
        const isLast = index === steps.length - 1;
        const isActive = index === currentStep;
        const isDone = index < currentStep;
        const isReached = isActive || isDone;

        return (
          <li
            key={label}
            className={`d-flex ${isLast ? "flex-shrink-0" : "flex-grow-1"}`}
            style={isLast ? { width: STEP_WIDTH } : undefined}
            aria-current={isActive ? "step" : undefined}
          >
            <span
              className="d-flex flex-column align-items-center flex-shrink-0"
              style={{ width: STEP_WIDTH }}
            >
              <span
                className={`d-flex align-items-center justify-content-center rounded-circle border ${
                  isReached
                    ? "bg-dark text-white border-dark"
                    : "bg-white text-secondary"
                }`}
                style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, fontSize: 12 }}
              >
                {isDone ? <Check size={14} aria-hidden="true" /> : index + 1}
              </span>
              <span
                className={`mt-1 text-nowrap ${
                  isReached ? "fw-semibold" : "text-secondary"
                }`}
                style={{ fontSize: 12 }}
              >
                {label}
                {isDone && <span className="visually-hidden"> (selesai)</span>}
              </span>
            </span>

            {/* Konektor ke langkah berikutnya; sejajar dengan tengah lingkaran */}
            {!isLast && (
              <span
                className="flex-grow-1"
                style={{
                  // Bukan border-top: kelas Bootstrap itu !important sehingga warna inline kalah.
                  backgroundColor: "var(--color-brand-primary)",
                  marginTop: CIRCLE_SIZE / 2,
                  height: 1,
                }}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
