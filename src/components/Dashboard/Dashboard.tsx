import Icon from "../Icons/Icons";
import styles from "./Dashboard.module.css";

function Dashboard({ children }: { children: React.ReactNode }) {
  return <div className={styles.wrapper}>{children}</div>;
}

// header
function DashboardHeader({ children }: { children: React.ReactNode }) {
  return <header className={styles.header}>{children}</header>;
}

function DashboardHeaderActions({ children }: { children: React.ReactNode }) {
  return <div className={styles.headerActions}>{children}</div>;
}

function DashboardHeaderSearch({ children }: { children: React.ReactNode }) {
  return <div className={styles.headerSearch}>{children}</div>;
}

function DashboardHeaderFiltersTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.headerTrigger}>{children}</div>;
}

function DashboardSkipMain() {
  return (
    <a href="#main" className={styles.skipMain}>
      Skip to main
    </a>
  );
}

function DashboardSkipFilters() {
  return (
    <a href="#filters" className={styles.skipFilters}>
      Skip to filters
    </a>
  );
}

// filters
function Filters({ children }: { children: React.ReactNode }) {
  return (
    <aside id="filters" className={styles.aside} aria-label="Filters">
      {children}
    </aside>
  );
}

// main
function DashboardMain({ children }: { children: React.ReactNode }) {
  return <div className={styles.main}>{children}</div>;
}

function DashboardMainPills({ children }: { children: React.ReactNode }) {
  return <div className={styles.pills}>{children}</div>;
}

function DashboardMainPillsStats({ children }: { children: React.ReactNode }) {
  return <div className={styles.pillsStats}>{children}</div>;
}

function DashboardMainPillsContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.pillsContent}>{children}</div>;
}

function DashboardMainPillsButton({ onClick }: { onClick: () => void }) {
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

function DashboardMainCritical({ errorMessage }: { errorMessage: string }) {
  return (
    <p className={styles.critical} role="alert">
      {errorMessage}
    </p>
  );
}

function DashboardMainLinks({
  children,
  ref,
}: {
  children: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}) {
  return (
    <main
      id="main"
      ref={ref}
      className={styles.links}
      aria-labelledby="saved-links"
    >
      <h1 className="visually-hidden" id="saved-links">
        Saved links
      </h1>
      {children}
    </main>
  );
}

function DashboardMainLinksList({ children }: { children: React.ReactNode }) {
  return (
    <ul className={styles.list} role="list">
      {children}
    </ul>
  );
}

function DashboardMainPagination({ children }: { children: React.ReactNode }) {
  return (
    <nav aria-label="Pagination" className={styles.pagination}>
      {children}
    </nav>
  );
}

Dashboard.Header = DashboardHeader;
Dashboard.HeaderActions = DashboardHeaderActions;
Dashboard.HeaderSearch = DashboardHeaderSearch;
Dashboard.HeaderTrigger = DashboardHeaderFiltersTrigger;

Dashboard.SkipMain = DashboardSkipMain;
Dashboard.SkipFilters = DashboardSkipFilters;

Dashboard.Filters = Filters;

Dashboard.Main = DashboardMain;
Dashboard.MainPills = DashboardMainPills;
Dashboard.MainPillsStats = DashboardMainPillsStats;
Dashboard.MainPillsContent = DashboardMainPillsContent;
Dashboard.MainPillsButton = DashboardMainPillsButton;
Dashboard.MainCritical = DashboardMainCritical;
Dashboard.MainLinks = DashboardMainLinks;
Dashboard.MainLinksList = DashboardMainLinksList;
Dashboard.Pagination = DashboardMainPagination;

export default Dashboard;
