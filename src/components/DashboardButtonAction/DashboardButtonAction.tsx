import styles from "./DashboardButtonAction.module.css";

function DashboardButtonAction({
	ariaPressed,
	ariaLabel,
	ariaKeyShortcuts,
	text,
	onClick,
	destructive,
	disabled,
	holding,
}: {
	ariaPressed?: boolean;
	ariaLabel?: string;
	ariaKeyShortcuts?: string;
	text: string;
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
	destructive?: boolean;
	disabled?: boolean;
	holding?: boolean;
}) {
	return (
		<button
			type="button"
			className={[
				styles.button,
				destructive ? styles.destructive : null,
				holding ? styles.holding : null,
			]
				.filter(Boolean)
				.join(" ")}
			onClick={disabled ? undefined : onClick}
			aria-disabled={disabled || undefined}
			aria-pressed={ariaPressed}
			aria-label={ariaLabel}
			aria-keyshortcuts={ariaKeyShortcuts}
		>
			{text}
		</button>
	);
}

export default DashboardButtonAction;
