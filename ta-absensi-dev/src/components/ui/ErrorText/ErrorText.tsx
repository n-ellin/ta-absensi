interface ErrorTextProps {
  message?: string;
}

export function ErrorText({ message }: ErrorTextProps) {
  if (!message) return null;

  return (
    <p className="text-danger small mt-1 mb-0" role="alert">
      {message}
    </p>
  );
}
