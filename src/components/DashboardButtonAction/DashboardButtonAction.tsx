import styles from "./DashboardButtonAction.module.css";

function DashbrardButtonAction({
	ariaPressed,
	text,
	onClick,
	destructive,
}: {
	ariaPressed?: boolean;
	text: string;
	onClick: () => void;
	destructive?: boolean;
}) {
	return (
		<button
			type="button"
			className={[styles.button, destructive ? styles.destructive : null]
				.filter(Boolean)
				.join(" ")}
			onClick={onClick}
			aria-pressed={ariaPressed}
		>
			{text}
		</button>
	);
}

export default DashbrardButtonAction;
