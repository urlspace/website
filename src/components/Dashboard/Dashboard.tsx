import styles from "./Dashboard.module.css";

function Dashboard({
  children,
}: {
  children: React.ReactNode;
  narrow?: boolean;
}) {
  return <div className={styles.wrapper}>{children}</div>;
}

function DashboardHeader({ children }: { children: React.ReactNode }) {
  return <header className={styles.header}>{children}</header>;
}

function DashboardHeaderLogo({ children }: { children: React.ReactNode }) {
  return <header className={styles.headerLogo}>{children}</header>;
}

function DashboardHeaderActions({ children }: { children: React.ReactNode }) {
  return <header className={styles.headerActions}>{children}</header>;
}

function DashboardHeaderFilters({ children }: { children: React.ReactNode }) {
  return <header className={styles.headerFilters}>{children}</header>;
}

function DashboardFiltersTrigger({ children }: { children: React.ReactNode }) {
  return <header className={styles.headerTrigger}>{children}</header>;
}

function DashboardMain({ children }: { children: React.ReactNode }) {
  return <main className={styles.main}>{children}</main>;
}
function Aside({ children }: { children: React.ReactNode }) {
  return <div className={styles.aside}>{children}</div>;
}

Dashboard.Header = DashboardHeader;
Dashboard.HeaderLogo = DashboardHeaderLogo;
Dashboard.HeaderActions = DashboardHeaderActions;
Dashboard.HeaderFilters = DashboardHeaderFilters;
Dashboard.HeaderTrigger = DashboardFiltersTrigger;
Dashboard.Main = DashboardMain;
Dashboard.Aside = Aside;

export default Dashboard;
