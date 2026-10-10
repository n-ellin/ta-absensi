import { useEffect, useId, type ReactNode } from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  icon?: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode; // area tombol
}

export function Modal({
  open,
  onClose,
  icon,
  title,
  description,
  children,
}: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={onClose}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content border-0 shadow text-center p-4">
            {icon && (
              <div className="d-flex justify-content-center mb-2">{icon}</div>
            )}
            <h2 id={titleId} className="h6 fw-bold mb-1">
              {title}
            </h2>
            {description && (
              <p className="text-secondary small mb-3">{description}</p>
            )}
            {children && <div className="d-flex gap-2">{children}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
