import styles from "./DashboardMenu.module.css";

function DashbrardMenu({ children }: { children: React.ReactNode }) {
	return <menu className={styles.list}>{children}</menu>;
}

function DashbrardMenuLi({ children }: { children: React.ReactNode }) {
	return <li className={styles.item}>{children}</li>;
}

function DashboardMenuButton({
	text,
	ariaPressed,
	onClick,
}: {
	text: string;
	ariaPressed?: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			className={styles.btn}
			aria-pressed={ariaPressed}
			onClick={onClick}
		>
			{text}
		</button>
	);
}

DashbrardMenu.Li = DashbrardMenuLi;

export default DashbrardMenu;
