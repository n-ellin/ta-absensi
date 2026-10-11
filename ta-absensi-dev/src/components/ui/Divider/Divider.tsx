interface DividerProps {
  text?: string;
}

export function Divider({ text }: DividerProps) {
  return (
    <div className="d-flex align-items-center gap-3 my-3 text-secondary small">
      <hr className="flex-grow-1 m-0" />
      {text && <span>{text}</span>}
      <hr className="flex-grow-1 m-0" />
    </div>
  );
}
