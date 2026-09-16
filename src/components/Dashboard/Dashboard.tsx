import Icon from "../Icons/Icons";
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

function DashboardHeaderActions({ children }: { children: React.ReactNode }) {
  return <div className={styles.headerActions}>{children}</div>;
}

function DashboardHeaderSearch({ children }: { children: React.ReactNode }) {
  return <div className={styles.headerSearch}>{children}</div>;
}

function DashboardFiltersTrigger({ children }: { children: React.ReactNode }) {
  return <div className={styles.headerTrigger}>{children}</div>;
}

function DashboardMain({ children }: { children: React.ReactNode }) {
  return <main className={styles.main}>{children}</main>;
}

function DashboardPills({ children }: { children: React.ReactNode }) {
  return <div className={styles.pills}>{children}</div>;
}

function DashboardPillsStats({ children }: { children: React.ReactNode }) {
  return <div className={styles.pillsStats}>{children}</div>;
}

function DashboardPillsContent({ children }: { children: React.ReactNode }) {
  return <div className={styles.pillsContent}>{children}</div>;
}

function DashboardPillsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className={styles.pillsButton}
      onClick={onClick}
      aria-label="Close filters"
    >
      <Icon.Close />
    </button>
  );
}

function Aside({ children }: { children: React.ReactNode }) {
  return <aside className={styles.aside}>{children}</aside>;
}

Dashboard.Header = DashboardHeader;
Dashboard.HeaderActions = DashboardHeaderActions;
Dashboard.HeaderSearch = DashboardHeaderSearch;
Dashboard.HeaderTrigger = DashboardFiltersTrigger;
Dashboard.Pills = DashboardPills;
Dashboard.PillsStats = DashboardPillsStats;
Dashboard.PillsContent = DashboardPillsContent;
Dashboard.PillsButton = DashboardPillsButton;
Dashboard.Main = DashboardMain;
Dashboard.Aside = Aside;

export default Dashboard;
