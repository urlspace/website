import styles from "./Dashboard.module.css";

function Dashboard({
  children,
}: {
  children: React.ReactNode;
  narrow?: boolean;
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>{children}</div>
    </div>
  );
}

function DashboardHeader({ children }: { children: React.ReactNode }) {
  return <header className={styles.header}>{children}</header>;
}

function DashboardMain({ children }: { children: React.ReactNode }) {
  return <main className={styles.main}>{children}</main>;
}
function Aside({ children }: { children: React.ReactNode }) {
  return <div className={styles.aside}>{children}</div>;
}

Dashboard.Header = DashboardHeader;
Dashboard.Main = DashboardMain;
Dashboard.Aside = Aside;

export default Dashboard;
