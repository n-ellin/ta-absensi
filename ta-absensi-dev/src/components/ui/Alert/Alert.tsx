interface AlertProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
}

const Alert = ({ message, type = "info" }: AlertProps) => {
  return (
    <div role="alert" data-type={type}>
      {message}
    </div>
  );
};

export default Alert;
