import styles from "./DashboardList.module.css";

function DashbrardList({
  ariaLabel,
  children,
}: {
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <ul className={styles.list} role="list" aria-label={ariaLabel}>
      {children}
    </ul>
  );
}

function DashbrardListLi({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <li
      className={[styles.item, loading && styles.loading]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </li>
  );
}

DashbrardList.Li = DashbrardListLi;

export default DashbrardList;
