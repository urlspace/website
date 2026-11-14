import { Link } from "@tanstack/react-router";

import styles from "./DashboardButton.module.css";

function DashbrardButtonLink({
	text,
	icon,
	to,
	hash,
	reloadDocument,
	preload,
	onClick,
}: {
	icon?: React.ReactNode;
	text: string;
	to: string;
	hash?: string;
	reloadDocument?: boolean;
	preload?: false;
	onClick?: () => void;
}) {
	return (
		<Link
			to={to}
			hash={hash}
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
