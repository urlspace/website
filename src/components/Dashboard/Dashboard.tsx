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

function DashboardStandaloneOnly({ children }: { children: React.ReactNode }) {
	return <div className={styles.standaloneOnly}>{children}</div>;
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
		<button
			type="button"
			className={styles.skipMain}
			onClick={() =>
				document.getElementById("main")?.focus({ preventScroll: true })
			}
		>
			Skip to links
		</button>
	);
}

function DashboardSkipFilters() {
	return (
		<button
			type="button"
			className={styles.skipFilters}
			onClick={() =>
				document.getElementById("filters")?.focus({ preventScroll: true })
			}
		>
			Skip to filters
		</button>
	);
}

// filters
function Filters({ children }: { children: React.ReactNode }) {
	return (
		<aside
			id="filters"
			tabIndex={-1}
			className={styles.aside}
			aria-label="Filters"
		>
			{children}
		</aside>
	);
}

// main
function DashboardMain({ children }: { children: React.ReactNode }) {
	return <div className={styles.main}>{children}</div>;
}

function DashboardMainStats({ children }: { children: React.ReactNode }) {
	return <div className={styles.stats}>{children}</div>;
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
			tabIndex={-1}
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
Dashboard.StandaloneOnly = DashboardStandaloneOnly;
Dashboard.HeaderSearch = DashboardHeaderSearch;
Dashboard.HeaderTrigger = DashboardHeaderFiltersTrigger;

Dashboard.SkipMain = DashboardSkipMain;
Dashboard.SkipFilters = DashboardSkipFilters;

Dashboard.Filters = Filters;

Dashboard.Main = DashboardMain;
Dashboard.MainStats = DashboardMainStats;
Dashboard.MainCritical = DashboardMainCritical;
Dashboard.MainLinks = DashboardMainLinks;
Dashboard.MainLinksList = DashboardMainLinksList;
Dashboard.Pagination = DashboardMainPagination;

export default Dashboard;
