import styles from "./DashboardList.module.css";

function DashbrardList({ children }: { children: React.ReactNode }) {
	return <ul className={styles.list}>{children}</ul>;
}

function DashbrardListLi({ children }: { children: React.ReactNode }) {
	return <li>{children}</li>;
}

DashbrardList.Li = DashbrardListLi;

export default DashbrardList;
