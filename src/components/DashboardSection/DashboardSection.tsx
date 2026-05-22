import styles from "./DashboardSection.module.css";

function DashbrardLogo({
  children,
  desktopHide,
  search,
}: {
  children: React.ReactNode;
  desktopHide?: boolean;
  search?: boolean;
}) {
  return (
    <div
      className={[
        styles.section,
        desktopHide && styles.desktopHide,
        search && styles.search,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export default DashbrardLogo;
