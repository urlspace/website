import styles from "./DashboardSection.module.css";

function DashbrardLogo({ children }: { children: React.ReactNode }) {
  return <div className={styles.section}>{children}</div>;
}

export default DashbrardLogo;
