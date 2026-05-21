import { Link } from "@tanstack/react-router";
import styles from "./Button.module.css";

function Button({
  text,
  onClick,
  type,
  disabled,
  ariaDisabled,
  fullWidth,
}: {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaDisabled?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <button
      className={[styles.button, fullWidth && styles.fullWidth]
        .filter(Boolean)
        .join(" ")}
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
