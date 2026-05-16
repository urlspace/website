import { Link } from "@tanstack/react-router";
import "./Button.css";

function Button({
  text,
  onClick,
  type,
  disabled,
  ariaDisabled,
}: {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaDisabled?: boolean;
}) {
  return (
    <button
      className="button"
      onClick={onClick}
      type={type}
      disabled={disabled}
      aria-disabled={ariaDisabled}
    >
      {text}
    </button>
  );
}

function ButtonLink({ text, to }: { text: string; to: string }) {
  return (
    <Link className="button" to={to}>
      {text}
    </Link>
  );
}

export { Button, ButtonLink };
