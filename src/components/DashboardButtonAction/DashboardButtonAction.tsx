import styles from "./DashboardButtonAction.module.css";

function DashboardButtonAction({
	ariaPressed,
	ariaLabel,
	text,
	onClick,
	destructive,
	disabled,
}: {
	ariaPressed?: boolean;
	ariaLabel?: string;
	text: string;
	onClick: () => void;
	destructive?: boolean;
	disabled?: boolean;
}) {
	return (
		<button
			type="button"
			className={[styles.button, destructive ? styles.destructive : null]
				.filter(Boolean)
				.join(" ")}
			onClick={onClick}
			disabled={disabled}
			aria-pressed={ariaPressed}
			aria-label={ariaLabel}
		>
			{text}
		</button>
	);
}

export default DashboardButtonAction;
