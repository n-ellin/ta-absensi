interface ErrorTextProps {
  message?: string;
}

const ErrorText = ({ message }: ErrorTextProps) => {
  if (!message) {
    return null;
  }

  return <p role="alert">{message}</p>;
};

export default ErrorText;
