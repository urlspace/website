import styles from "./DashboardButton.module.css";

function DashbrardButton({
	ariaPressed,
	text,
	counter,
	icon,
	onClick,
}: {
	ariaPressed?: boolean;
	icon?: React.ReactNode;
	text: string;
	counter?: number;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			className={styles.button}
			onClick={onClick}
			aria-pressed={ariaPressed}
		>
			{icon ? <div className={styles.icon}>{icon}</div> : null}
			<div className={styles.text}>
				{text}{" "}
				{counter || counter === 0 ? (
					<span className={styles.counter}>({counter})</span>
				) : null}
			</div>
		</button>
	);
}

export default DashbrardButton;
