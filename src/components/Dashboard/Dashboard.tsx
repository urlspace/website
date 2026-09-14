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

function DashboardFilter({
  children,
  show,
}: {
  children: React.ReactNode;
  show: boolean;
}) {
  return (
    <div
      className={[styles.filters, show && styles.filtersShow]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

function DashboardFilterContent({ children }: { children: React.ReactNode }) {
  return <div className={styles.filtersContent}>{children}</div>;
}

function DashboardFilterButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className={styles.filtersButton}
      onClick={onClick}
      aria-label="Close filters"
    >
      <Icon.Close />
    </button>
  );
}

function Aside({ children }: { children: React.ReactNode }) {
  return <div className={styles.aside}>{children}</div>;
}

function AsideStats({ children }: { children: React.ReactNode }) {
  return <div className={styles.asideStats}>{children}</div>;
}

Dashboard.Header = DashboardHeader;
Dashboard.HeaderActions = DashboardHeaderActions;
Dashboard.HeaderFilters = DashboardHeaderFilters;
Dashboard.HeaderTrigger = DashboardFiltersTrigger;
Dashboard.Filter = DashboardFilter;
Dashboard.FilterContent = DashboardFilterContent;
Dashboard.FilterButton = DashboardFilterButton;
Dashboard.Main = DashboardMain;
Dashboard.Aside = Aside;
Dashboard.AsideStats = AsideStats;

export default Dashboard;
