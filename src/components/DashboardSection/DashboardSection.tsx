import styles from "./DashboardSection.module.css";

function DashbrardLogo({
  children,
  desktopHide,
}: {
  children: React.ReactNode;
  desktopHide?: boolean;
}) {
  return (
    <div
      className={[styles.section, desktopHide && styles.desktopHide]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export default DashbrardLogo;
