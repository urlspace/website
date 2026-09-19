import { Link } from "@tanstack/react-router";
import styles from "./Logo.module.css";

function Logo({ to }: { to: string }) {
  return (
    <Link to={to} className={styles.logo}>
      url.space
    </Link>
  );
}

export default Logo;
