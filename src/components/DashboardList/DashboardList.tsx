import styles from "./DashboardList.module.css";

function DashbrardList({ children }: { children: React.ReactNode }) {
	return <ul className={styles.list}>{children}</ul>;
}

function DashbrardListLi({
	children,
	highlightOnHover,
	loading,
}: {
	children: React.ReactNode;
	highlightOnHover?: boolean;
	loading?: boolean;
}) {
	return (
		<li
			className={[
				styles.item,
				highlightOnHover && styles.highlightOnHover,
				loading && styles.loading,
			]
				.filter(Boolean)
				.join(" ")}
		>
			{children}
		</li>
	);
}

DashbrardList.Li = DashbrardListLi;

export default DashbrardList;
