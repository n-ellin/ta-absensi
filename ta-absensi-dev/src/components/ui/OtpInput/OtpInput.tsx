import {
  Fragment,
  useEffect,
  useRef,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

export interface OtpInputProps {
  /** Digit yang sudah diisi, berurutan tanpa celah (maks. `length`). */
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  /** Border merah. */
  invalid?: boolean;
  /** Border hijau. */
  valid?: boolean;
  /** Digit abu-abu (dipakai saat error server, sukses, atau loading, sesuai Figma). */
  muted?: boolean;
  /** Fokus ke kotak pertama saat kosong dan aktif. */
  autoFocus?: boolean;
  label?: string;
  describedBy?: string;
}

export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  invalid = false,
  valid = false,
  muted = false,
  autoFocus = false,
  label = `Kode OTP ${length} digit`,
  describedBy,
}: OtpInputProps) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const isEmpty = value === "";

  // Nilai terbaru yang sinkron dengan event. Memindahkan fokus terjadi di dalam
  // event yang sama sebelum React me-render ulang, jadi handler (mis. onFocus)
  // tidak boleh membaca `value` dari render sebelumnya.
  const latest = useRef(value);
  useEffect(() => {
    latest.current = value;
  }, [value]);

  const commit = (next: string) => {
    latest.current = next;
    onChange(next);
  };

  useEffect(() => {
    if (autoFocus && !disabled && isEmpty) inputs.current[0]?.focus();
  }, [autoFocus, disabled, isEmpty]);

  const focusAt = (index: number) => {
    const target = inputs.current[Math.min(Math.max(index, 0), length - 1)];
    target?.focus();
  };

  // Tulis `digits` mulai dari kotak `from` (dipakai paste dan autofill SMS).
  const fillFrom = (from: number, digits: string) => {
    const next = (latest.current.slice(0, from) + digits).slice(0, length);
    commit(next);
    focusAt(next.length);
  };

  const handleChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const digits = event.target.value.replace(/\D/g, "");
      if (!digits) return; // bukan angka: abaikan

      if (digits.length > 2) {
        fillFrom(index, digits); // autofill mengisi seluruh kode ke satu kotak
        return;
      }
      // Ketik biasa: ganti satu digit di posisi ini, digit sesudahnya tetap.
      // `data` = karakter yang baru diketik (akurat walau kursor di kiri digit lama).
      const typed = (event.nativeEvent as InputEvent).data;
      const digit = typed && /^\d$/.test(typed) ? typed : digits.slice(-1);
      const current = latest.current;
      const next = current.slice(0, index) + digit + current.slice(index + 1);
      commit(next.slice(0, length));
      focusAt(index + 1);
    };

  const handleKeyDown =
    (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
      const current = latest.current;
      const hasDigit = index < current.length;

      switch (event.key) {
        case "Backspace":
          event.preventDefault();
          if (hasDigit) {
            commit(current.slice(0, index) + current.slice(index + 1));
          } else if (index > 0) {
            commit(current.slice(0, index - 1) + current.slice(index));
            focusAt(index - 1);
          }
          break;
        case "Delete":
          event.preventDefault();
          if (hasDigit) commit(current.slice(0, index) + current.slice(index + 1));
          break;
        case "ArrowLeft":
          event.preventDefault();
          focusAt(index - 1);
          break;
        case "ArrowRight":
          event.preventDefault();
          focusAt(Math.min(index + 1, current.length));
          break;
      }
    };

  const handlePaste =
    (index: number) => (event: ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      const digits = event.clipboardData.getData("text").replace(/\D/g, "");
      if (digits) fillFrom(index, digits);
    };

  const boxClass = [
    "otp-input__box",
    invalid && "otp-input__box--invalid",
    valid && "otp-input__box--valid",
    muted && "otp-input__box--muted",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className="otp-input"
      role="group"
      aria-label={label}
      aria-describedby={describedBy}
    >
      {Array.from({ length }, (_, index) => (
        <Fragment key={index}>
          {index > 0 && index === length / 2 && (
            <span className="otp-input__dash" aria-hidden="true" />
          )}
          <input
            ref={(element: HTMLInputElement | null) => {
              inputs.current[index] = element;
            }}
            className={boxClass}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            placeholder="·"
            value={value[index] ?? ""}
            disabled={disabled}
            aria-label={`Digit ${index + 1} dari ${length}`}
            aria-invalid={invalid || undefined}
            onChange={handleChange(index)}
            onKeyDown={handleKeyDown(index)}
            onPaste={handlePaste(index)}
            onFocus={() => {
              // Tidak boleh melompati kotak kosong: arahkan ke kotak kosong pertama.
              const filled = latest.current.length;
              if (index > filled) focusAt(filled);
            }}
          />
        </Fragment>
      ))}
    </div>
  );
}
