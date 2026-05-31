import styles from "./DashboardSection.module.css";

function DashbrardLogo({
  children,
  search,
}: {
  children: React.ReactNode;
  search?: boolean;
}) {
  return (
    <div
      className={[styles.section, search && styles.search]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export default DashbrardLogo;
