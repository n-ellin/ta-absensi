import type { SVGProps } from "react";

interface FadeArcProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export function FadeArc({ className = "", style, ...props }: FadeArcProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="status"
      aria-label="Memuat"
      className={`animate-spin ${className}`}
      style={{
        width: "3.75rem",
        height: "3.75rem",
        animationDuration: "1.2s",
        ...style,
      }}
      {...props}
    >
      <defs>
        <linearGradient
          id="fade-arc-gradient"
          x1="8"
          y1="8"
          x2="40"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="55%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
        </linearGradient>
      </defs>

      <circle
        cx="24"
        cy="24"
        r="18"
        stroke="currentColor"
        strokeOpacity="0.08"
        strokeWidth="4"
      />

      <path
        d="M 24 6 A 18 18 0 0 1 42 24"
        stroke="url(#fade-arc-gradient)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M 42 24 A 18 18 0 0 1 24 42"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />
    </svg>
  );
}
