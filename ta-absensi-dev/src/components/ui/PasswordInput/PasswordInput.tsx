import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input, type InputProps } from "../Input";

type PasswordInputProps = Omit<InputProps, "type" | "rightElement">;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <Input
        ref={ref}
        {...props}
        type={visible ? "text" : "password"}
        rightElement={
          <button
            type="button"
            className="btn btn-link text-secondary text-decoration-none shadow-none px-3 py-0 border-0"
            onClick={() => setVisible((prev) => !prev)}
            aria-label={
              visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
            }
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />
    );
  },
);

PasswordInput.displayName = "PasswordInput";
