import { Link } from "@tanstack/react-router";
import styles from "./DashboardButton.module.css";

function DashbrardButtonLink({
  text,
  icon,
  to,
  reloadDocument,
}: {
  icon?: React.ReactNode;
  text: string;
  to: string;
  reloadDocument?: boolean;
}) {
  return (
    <Link to={to} reloadDocument={reloadDocument} className={styles.button}>
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <span className={styles.text}>{text} </span>
    </Link>
  );
}

export default DashbrardButtonLink;
