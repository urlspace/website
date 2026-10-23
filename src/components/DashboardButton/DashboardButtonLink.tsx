import { Link } from "@tanstack/react-router";

import styles from "./DashboardButton.module.css";

function DashbrardButtonLink({
	text,
	icon,
	to,
	reloadDocument,
	preload,
	onClick,
}: {
	icon?: React.ReactNode;
	text: string;
	to: string;
	reloadDocument?: boolean;
	preload?: false;
	onClick?: () => void;
}) {
	return (
		<Link
			to={to}
			reloadDocument={reloadDocument}
			preload={preload}
			className={styles.button}
			onClick={onClick}
		>
			{icon ? <span className={styles.icon}>{icon}</span> : null}
			<span className={styles.text}>{text} </span>
		</Link>
	);
}

export default DashbrardButtonLink;
