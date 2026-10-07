import { useNavigate, useParams } from "react-router-dom";
import { ErrorIllustration } from "../components/ErrorIllustration";

type ErrorContent = {
  title: string;
  description: string;
  actionLabel: string;
  actionTo: string;
};

const ERROR_CONTENT: Record<string, ErrorContent> = {
  "400": {
    title: "Bad request",
    description:
      "The request could not be understood. Please check the address or the information you sent and try again.",
    actionLabel: "Go Home",
    actionTo: "/",
  },
  "401": {
    title: "Sign in required",
    description:
      "You need to sign in to view this page. Please log in with your account and try again.",
    actionLabel: "Go to Login",
    actionTo: "/login",
  },
  "403": {
    title: "Access denied",
    description:
      "You don't have permission to view this page. If you think this is a mistake, please contact your administrator.",
    actionLabel: "Go Home",
    actionTo: "/",
  },
  "404": {
    title: "Page not found",
    description:
      "Sorry, the page you are looking for could not be found. It may have been moved, deleted, or never existed.",
    actionLabel: "Go Home",
    actionTo: "/",
  },
  "500": {
    title: "Something went wrong",
    description:
      "An unexpected error occurred on our side. Please try again in a moment.",
    actionLabel: "Back to Home",
    actionTo: "/",
  },
  "503": {
    title: "Service unavailable",
    description:
      "We're temporarily unable to handle your request. Please try again in a few minutes.",
    actionLabel: "Back to Home",
    actionTo: "/",
  },
};

const DEFAULT_CONTENT: ErrorContent = {
  title: "Something went wrong",
  description:
    "An unexpected error occurred. Please try again or return to the home page.",
  actionLabel: "Go Home",
  actionTo: "/",
};

type ErrorPageProps = {
  code?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
};

export const ErrorPage = ({
  code,
  title,
  description,
  actionLabel,
  actionTo,
}: ErrorPageProps) => {
  const navigate = useNavigate();
  const params = useParams<{ code: string }>();

  const resolvedCode = code ?? params.code ?? "404";
  const preset = ERROR_CONTENT[resolvedCode] ?? DEFAULT_CONTENT;

  const content: ErrorContent = {
    title: title ?? preset.title,
    description: description ?? preset.description,
    actionLabel: actionLabel ?? preset.actionLabel,
    actionTo: actionTo ?? preset.actionTo,
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F5EFEF] px-6 py-12 sm:px-10 lg:px-16">
      {/* Decorative background elements */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none"
      >
        {/* Soft light blobs */}
        <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[#F9F5F5] blur-3xl" />
        <div className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-[#E9EEF2] opacity-70 blur-3xl" />

        {/* Thin lines */}
        <div className="absolute left-0 top-1/3 h-px w-24 bg-[#A47745]/25 sm:w-48" />
        <div className="absolute bottom-1/4 right-0 h-px w-24 bg-[#A05252]/25 sm:w-48" />
        <div className="absolute left-8 top-0 h-24 w-px bg-[#282333]/10 sm:left-16 sm:h-40" />
        <div className="absolute bottom-0 right-8 h-24 w-px bg-[#282333]/10 sm:right-16 sm:h-40" />

        {/* Symbols */}
        <span className="absolute left-[6%] top-[12%] text-2xl font-light text-[#A47745]/40 sm:text-3xl">
          ×
        </span>
        <span className="absolute right-[8%] top-[14%] text-xl font-light text-[#A05252]/40 sm:text-2xl">
          +
        </span>
        <span className="absolute bottom-[14%] left-[10%] text-lg text-[#A05252]/35 sm:text-xl">
          ✦
        </span>
        <span className="absolute bottom-[10%] right-[8%] text-2xl font-light text-[#A47745]/40 sm:text-3xl">
          ×
        </span>

        {/* Dots */}
        <span className="absolute left-[20%] top-[10%] h-1.5 w-1.5 rounded-full bg-[#A47745]/35" />
        <span className="absolute right-[24%] top-[8%] h-1 w-1 rounded-full bg-[#A05252]/35" />
        <span className="absolute bottom-[24%] right-[6%] h-1.5 w-1.5 rounded-full bg-[#A47745]/30" />
        <span className="absolute bottom-[8%] left-[28%] h-1 w-1 rounded-full bg-[#A05252]/30" />
      </div>

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-10 lg:flex-row lg:gap-16">
        {/* Text column */}
        <div className="flex w-full flex-col items-center text-center lg:w-1/2 lg:items-start lg:text-left">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-8 bg-[#A47745]/60 sm:w-12" />
            <span className="text-xs font-medium uppercase tracking-[0.35em] text-[#A47745] sm:text-sm">
              Error
            </span>
          </div>

          <p
            aria-hidden="true"
            className="font-serif text-7xl font-medium leading-none tracking-tight text-[#282333] sm:text-8xl lg:text-9xl"
          >
            {resolvedCode}
            <span className="ml-1 text-[#A47745]">.</span>
          </p>

          <div className="mt-6 flex items-center gap-3">
            <span aria-hidden="true" className="text-lg text-[#A05252]/70">
              ✦
            </span>
            <h1 className="font-serif text-3xl font-medium tracking-tight text-[#282333] sm:text-4xl md:text-5xl">
              {content.title}
            </h1>
          </div>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-[#514857] sm:text-base">
            {content.description}
          </p>

          <button
            type="button"
            onClick={() => navigate(content.actionTo)}
            className="group mt-10 inline-flex items-center gap-4 rounded-full bg-[#282333] py-2 pl-7 pr-2 text-sm font-medium tracking-wide text-white shadow-[0_6px_18px_-8px_rgba(40,35,51,0.5)] transition-all duration-300 ease-out hover:gap-5 hover:shadow-[0_14px_30px_-10px_rgba(40,35,51,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A47745] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5EFEF] sm:text-base"
          >
            <span>{content.actionLabel}</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#282333] transition-transform duration-300 ease-out group-hover:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </button>
        </div>

        {/* Illustration column */}
        <div className="flex w-full max-w-md items-center justify-center sm:max-w-xl lg:w-1/2 lg:max-w-none">
          <ErrorIllustration />
        </div>
      </section>
    </main>
  );
};
