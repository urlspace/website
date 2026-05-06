import { Link } from "@tanstack/react-router";
import "./Button.css";

function Button({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button className="button" onClick={onClick}>
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
