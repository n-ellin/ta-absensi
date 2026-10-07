import { useState } from "react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = (props: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input {...props} type={showPassword ? "text" : "password"} />

      <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
        {showPassword ? "Sembunyikan" : "Tampilkan"}
      </button>
    </div>
  );
};

export default PasswordInput;
