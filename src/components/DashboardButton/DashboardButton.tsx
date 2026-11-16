import styles from "./DashboardButton.module.css";

function DashbrardButton({
	ariaKeyShortcuts,
	ariaPressed,
	counter,
	destructive,
	disabled,
	icon,
	onClick,
	text,
}: {
	ariaKeyShortcuts?: string;
	ariaPressed?: boolean;
	counter?: number;
	destructive?: boolean;
	disabled?: boolean;
	icon?: React.ReactNode;
	onClick: () => void;
	text: string;
}) {
	return (
		<button
			type="button"
			className={[
				styles.button,
				destructive ? styles.buttonDestructive : null,
			].join(" ")}
			onClick={disabled ? undefined : onClick}
			aria-disabled={disabled || undefined}
			aria-pressed={ariaPressed}
			aria-keyshortcuts={ariaKeyShortcuts}
		>
			{icon ? <span className={styles.icon}>{icon}</span> : null}
			<span className={styles.text}>
				{text}{" "}
				{counter || counter === 0 ? (
					<span className={styles.counter}>
						({counter}
						<span className="visually-hidden">
							{counter === 1 ? " link" : " links"}
						</span>
						){" "}
					</span>
				) : null}
				{
					// this space at the end of the span is intentional
					// there is a terrible bug in safari that cuts off the last
					// closing parenthesis in the overflow: hodden containers
					// awful bug, and maybe one day i will have a better solutoin but for know
					// adding extra space is the simplext fix in this case
				}
			</span>
		</button>
	);
}

export default DashbrardButton;
