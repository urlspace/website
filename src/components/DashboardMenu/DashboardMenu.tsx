import styles from "./DashboardMenu.module.css";

function DashbrardMenu({
	children,
	fadeIn,
	order,
}: {
	children: React.ReactNode;
	fadeIn?: boolean;
	order?: number;
}) {
	return (
		<menu
			className={[styles.list, fadeIn && styles.fadeIn]
				.filter(Boolean)
				.join(" ")}
			style={{
				animationDelay: fadeIn && order ? `${order * 3}ms` : undefined,
			}}
		>
			{children}
		</menu>
	);
}

function DashbrardMenuLi({ children }: { children: React.ReactNode }) {
	return <li className={styles.item}>{children}</li>;
}

DashbrardMenu.Li = DashbrardMenuLi;

export default DashbrardMenu;
