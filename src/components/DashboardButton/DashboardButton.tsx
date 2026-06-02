import styles from "./DashboardButton.module.css";

function DashbrardButton({
	ariaPressed,
	text,
	icon,
	onClick,
}: {
	ariaPressed?: boolean;
	icon?: React.ReactNode;
	text: string;
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
			<div className={styles.text}>{text}</div>
		</button>
	);
}

export default DashbrardButton;
