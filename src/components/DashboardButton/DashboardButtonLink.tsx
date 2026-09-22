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
      {icon ? <div className={styles.icon}>{icon}</div> : null}
      <div className={styles.text}>{text} </div>
    </Link>
  );
}

export default DashbrardButtonLink;
