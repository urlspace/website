import styles from "./DashboardButtonAction.module.css";

function DashbrardButtonAction({
	ariaPressed,
	ariaLabel,
	text,
	onClick,
	destructive,
}: {
	ariaPressed?: boolean;
	ariaLabel?: string;
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
			aria-label={ariaLabel}
		>
			{text}
		</button>
	);
}

export default DashbrardButtonAction;
